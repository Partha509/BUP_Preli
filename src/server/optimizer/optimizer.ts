import {
  BatteryParams,
  DirectiveInterpretation,
  HourEntry,
  HourlyPlanEntry,
  OptimizeEnergyResponse,
} from "@/lib/types/gridwise";
import { computeEffectiveSolar } from "./solar";
import { LpSolver } from "./lp-solver";
import { replayAndVerifySchedule } from "./replay";

export class OptimizationError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 422) {
    super(message);
    this.name = "OptimizationError";
    this.statusCode = statusCode;
  }
}

/**
 * Deterministically optimizes the 24-hour campus energy schedule
 * using Two-Phase Simplex Linear Programming.
 */
export function optimizeEnergySchedule(
  scenarioId: string,
  hours: HourEntry[],
  battery: BatteryParams,
  directives: DirectiveInterpretation[]
): OptimizeEnergyResponse {
  // 1. Calculate effective solar after solar_reduction directives
  const effectiveSolar = computeEffectiveSolar(hours, directives);

  // 2. Extract directive parameters per hour
  const noChargeHours = new Set<number>();
  const noDischargeHours = new Set<number>();
  const maxGridLimits = new Map<number, number>();
  const minReserveLimits = new Map<number, number>();

  for (const dir of directives) {
    if (!dir.applies || !dir.structured_adjustment) continue;
    const dirHours = dir.structured_adjustment.hours || [];

    if (dir.directive_type === "no_charge_window") {
      dirHours.forEach((h) => noChargeHours.add(h));
    } else if (dir.directive_type === "no_discharge_window") {
      dirHours.forEach((h) => noDischargeHours.add(h));
    } else if (dir.directive_type === "max_grid_window") {
      const cap = (dir.structured_adjustment as any).max_grid_kwh;
      if (typeof cap === "number") {
        dirHours.forEach((h) => {
          const current = maxGridLimits.get(h) ?? Infinity;
          maxGridLimits.set(h, Math.min(current, cap));
        });
      }
    } else if (dir.directive_type === "minimum_battery_reserve") {
      const res = (dir.structured_adjustment as any).minimum_energy_kwh;
      if (typeof res === "number") {
        dirHours.forEach((h) => {
          const current = minReserveLimits.get(h) ?? battery.minimum_energy_kwh;
          minReserveLimits.set(h, Math.max(current, res));
        });
      }
    }
  }

  // 3. Formulate Linear Program
  // Variables for hour h (h = 0..23):
  // g_h: 5*h + 0 (grid kWh)
  // s_h: 5*h + 1 (solar used kWh)
  // c_h: 5*h + 2 (charge kWh)
  // d_h: 5*h + 3 (discharge kWh)
  // E_h: 5*h + 4 (battery energy at END of hour h)
  const numVars = 5 * 24;
  const c = new Array(numVars).fill(0);

  const EPSILON_CYCLE = 1e-6; // Small cost on battery action to prevent simultaneous charging & discharging

  for (let h = 0; h < 24; h++) {
    c[5 * h + 0] = hours[h].tariff_bdt_per_kwh; // Minimize grid purchase cost
    c[5 * h + 1] = 0.0;
    c[5 * h + 2] = EPSILON_CYCLE;
    c[5 * h + 3] = EPSILON_CYCLE;
    c[5 * h + 4] = 0.0;
  }

  const A_eq: number[][] = [];
  const b_eq: number[] = [];

  // Equality 1: Energy balance for each hour h
  // g_h + s_h + d_h - c_h = demand_h
  for (let h = 0; h < 24; h++) {
    const row = new Array(numVars).fill(0);
    row[5 * h + 0] = 1.0; // g_h
    row[5 * h + 1] = 1.0; // s_h
    row[5 * h + 2] = -1.0; // -c_h
    row[5 * h + 3] = 1.0; // d_h
    A_eq.push(row);
    b_eq.push(hours[h].demand_kwh);
  }

  // Equality 2: Battery transitions
  // h = 0: E_0 - c_0 + d_0 = initial_energy_kwh
  {
    const row = new Array(numVars).fill(0);
    row[5 * 0 + 4] = 1.0; // E_0
    row[5 * 0 + 2] = -1.0; // -c_0
    row[5 * 0 + 3] = 1.0; // d_0
    A_eq.push(row);
    b_eq.push(battery.initial_energy_kwh);
  }

  // h = 1..23: E_h - E_{h-1} - c_h + d_h = 0
  for (let h = 1; h < 24; h++) {
    const row = new Array(numVars).fill(0);
    row[5 * h + 4] = 1.0; // E_h
    row[5 * (h - 1) + 4] = -1.0; // -E_{h-1}
    row[5 * h + 2] = -1.0; // -c_h
    row[5 * h + 3] = 1.0; // d_h
    A_eq.push(row);
    b_eq.push(0.0);
  }

  // Equality 3: End-of-day battery neutrality
  // E_23 = initial_energy_kwh
  {
    const row = new Array(numVars).fill(0);
    row[5 * 23 + 4] = 1.0; // E_23
    A_eq.push(row);
    b_eq.push(battery.initial_energy_kwh);
  }

  // Inequality Constraints: A_ub * x <= b_ub
  const A_ub: number[][] = [];
  const b_ub: number[] = [];

  for (let h = 0; h < 24; h++) {
    // 1. Solar usage bound: s_h <= effective_solar_h
    {
      const row = new Array(numVars).fill(0);
      row[5 * h + 1] = 1.0;
      A_ub.push(row);
      b_ub.push(effectiveSolar[h]);
    }

    // 2. Battery capacity bound: E_h <= capacity_kwh
    {
      const row = new Array(numVars).fill(0);
      row[5 * h + 4] = 1.0;
      A_ub.push(row);
      b_ub.push(battery.capacity_kwh);
    }

    // 3. Minimum reserve bound: E_h >= minReserve => -E_h <= -minReserve
    {
      const minReserve = minReserveLimits.get(h) ?? battery.minimum_energy_kwh;
      const row = new Array(numVars).fill(0);
      row[5 * h + 4] = -1.0;
      A_ub.push(row);
      b_ub.push(-minReserve);
    }

    // 4. Charge rate limit: c_h <= max_charge
    {
      const maxCharge = noChargeHours.has(h) ? 0.0 : battery.max_charge_kwh_per_hour;
      const row = new Array(numVars).fill(0);
      row[5 * h + 2] = 1.0;
      A_ub.push(row);
      b_ub.push(maxCharge);
    }

    // 5. Discharge rate limit: d_h <= max_discharge
    {
      const maxDischarge = noDischargeHours.has(h) ? 0.0 : battery.max_discharge_kwh_per_hour;
      const row = new Array(numVars).fill(0);
      row[5 * h + 3] = 1.0;
      A_ub.push(row);
      b_ub.push(maxDischarge);
    }

    // 6. Max grid window limit: g_h <= max_grid_kwh
    const gridCap = maxGridLimits.get(h);
    if (gridCap !== undefined) {
      const row = new Array(numVars).fill(0);
      row[5 * h + 0] = 1.0;
      A_ub.push(row);
      b_ub.push(gridCap);
    }
  }

  // 4. Execute LP Simplex Solver
  const result = LpSolver.solve(c, A_eq, b_eq, A_ub, b_ub);

  if (result.status !== "optimal") {
    throw new OptimizationError(
      `Linear programming optimizer failed with status '${result.status}'. The scenario constraints or directives may be physically infeasible.`
    );
  }

  // 5. Extract and format hourly plan
  const sol = result.solution;
  const hourlyPlan: HourlyPlanEntry[] = [];

  let prevE = battery.initial_energy_kwh;

  for (let h = 0; h < 24; h++) {
    const rawG = Math.max(0, sol[5 * h + 0]);
    const rawS = Math.max(0, sol[5 * h + 1]);
    const rawC = Math.max(0, sol[5 * h + 2]);
    const rawD = Math.max(0, sol[5 * h + 3]);
    let rawE = Math.max(0, sol[5 * h + 4]);

    // Clean zero thresholds
    let chargeKwh = rawC > 1e-4 ? rawC : 0;
    let dischargeKwh = rawD > 1e-4 ? rawD : 0;

    // Prevent simultaneous charge & discharge
    if (chargeKwh > 0 && dischargeKwh > 0) {
      if (chargeKwh > dischargeKwh) {
        chargeKwh -= dischargeKwh;
        dischargeKwh = 0;
      } else {
        dischargeKwh -= chargeKwh;
        chargeKwh = 0;
      }
    }

    let action: "charge" | "discharge" | "idle" = "idle";
    let batteryKwh = 0;

    if (chargeKwh > 1e-4) {
      action = "charge";
      batteryKwh = Number(chargeKwh.toFixed(2));
    } else if (dischargeKwh > 1e-4) {
      action = "discharge";
      batteryKwh = Number(dischargeKwh.toFixed(2));
    }

    // Solar used: bounded by demand and effective solar
    const solarUsedKwh = Number(
      Math.min(effectiveSolar[h], Math.max(0, rawS)).toFixed(2)
    );

    // Energy balance conservation: grid = demand + charge - solar_used - discharge
    const calculatedGrid =
      hours[h].demand_kwh +
      (action === "charge" ? batteryKwh : 0) -
      solarUsedKwh -
      (action === "discharge" ? batteryKwh : 0);

    const gridKwh = Number(Math.max(0, calculatedGrid).toFixed(2));

    // Update battery energy at END of hour h
    const currentE =
      prevE +
      (action === "charge" ? batteryKwh : 0) -
      (action === "discharge" ? batteryKwh : 0);

    const batteryEnergyAfter = Number(
      (h === 23 ? battery.initial_energy_kwh : currentE).toFixed(2)
    );

    hourlyPlan.push({
      hour: h,
      grid_kwh: gridKwh,
      solar_used_kwh: solarUsedKwh,
      battery_action: action,
      battery_kwh: batteryKwh,
      battery_energy_after_kwh: batteryEnergyAfter,
    });

    prevE = batteryEnergyAfter;
  }

  // 6. Independent Replay Validation
  replayAndVerifySchedule(
    hourlyPlan,
    hours,
    battery,
    effectiveSolar,
    directives
  );

  // 7. Calculate Official Aggregate Totals
  const totalGridKwh = Number(
    hourlyPlan.reduce((sum, h) => sum + h.grid_kwh, 0).toFixed(2)
  );

  const totalCostBdt = Number(
    hourlyPlan
      .reduce((sum, h) => sum + h.grid_kwh * hours[h.hour].tariff_bdt_per_kwh, 0)
      .toFixed(2)
  );

  const peakGridKwh = Number(
    Math.max(...hourlyPlan.map((h) => h.grid_kwh)).toFixed(2)
  );

  // Generate concise narrative plan summary
  const appliedCount = directives.filter((d) => d.applies).length;
  const totalSolarUsed = hourlyPlan.reduce((sum, h) => sum + h.solar_used_kwh, 0);

  const planSummary = `Optimal 24-hour dispatch schedule successfully generated for ${scenarioId}. The linear programming solver minimized total grid electricity expenditure to ${totalCostBdt.toFixed(
    2
  )} BDT across ${totalGridKwh.toFixed(
    2
  )} kWh of grid import (peak draw: ${peakGridKwh.toFixed(
    2
  )} kWh). Utilized ${totalSolarUsed.toFixed(
    2
  )} kWh of rooftop solar and enforced ${appliedCount} operator directive constraint(s) while maintaining strict end-of-day battery neutrality ($E_{23} = E_0 = ${battery.initial_energy_kwh} kWh).`;

  return {
    scenario_id: scenarioId,
    directive_interpretation: directives,
    hourly_plan: hourlyPlan,
    total_grid_kwh: totalGridKwh,
    total_cost_bdt: totalCostBdt,
    peak_grid_kwh: peakGridKwh,
    plan_summary: planSummary,
  };
}
