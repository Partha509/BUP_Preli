import {
  BatteryParams,
  DirectiveInterpretation,
  HourEntry,
  HourlyPlanEntry,
} from "@/lib/types/gridwise";

export class ReplayValidationError extends Error {
  public violations: string[];

  constructor(violations: string[]) {
    super(
      `Independent Replay Validation Failed with ${violations.length} violation(s):\n - ${violations.join(
        "\n - "
      )}`
    );
    this.name = "ReplayValidationError";
    this.violations = violations;
  }
}

export function replayAndVerifySchedule(
  plan: HourlyPlanEntry[],
  hours: HourEntry[],
  battery: BatteryParams,
  effectiveSolar: number[],
  directives: DirectiveInterpretation[]
): void {
  const violations: string[] = [];
  const TOL = 0.015; // 0.01 kWh competition tolerance + small float margin

  if (!Array.isArray(plan) || plan.length !== 24) {
    throw new ReplayValidationError([
      `Hourly plan must have exactly 24 entries, received ${plan?.length}.`,
    ]);
  }

  // Pre-calculate directive constraints per hour
  const noChargeHours = new Set<number>();
  const noDischargeHours = new Set<number>();
  const maxGridByHour = new Map<number, number>();
  const minReserveByHour = new Map<number, number>();

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
          const current = maxGridByHour.get(h) ?? Infinity;
          maxGridByHour.set(h, Math.min(current, cap));
        });
      }
    } else if (dir.directive_type === "minimum_battery_reserve") {
      const res = (dir.structured_adjustment as any).minimum_energy_kwh;
      if (typeof res === "number") {
        dirHours.forEach((h) => {
          const current = minReserveByHour.get(h) ?? battery.minimum_energy_kwh;
          minReserveByHour.set(h, Math.max(current, res));
        });
      }
    }
  }

  let prevEnergy = battery.initial_energy_kwh;

  for (let h = 0; h < 24; h++) {
    const entry = plan[h];
    const reqHour = hours[h];
    const solarAvail = effectiveSolar[h];

    // 1. Hour index check
    if (entry.hour !== h) {
      violations.push(`Hour mismatch at index ${h}: entry.hour is ${entry.hour}`);
    }

    // 2. Non-negative check
    if (entry.grid_kwh < -TOL) {
      violations.push(`Hour ${h}: grid_kwh (${entry.grid_kwh}) is negative.`);
    }
    if (entry.solar_used_kwh < -TOL) {
      violations.push(`Hour ${h}: solar_used_kwh (${entry.solar_used_kwh}) is negative.`);
    }
    if (entry.battery_kwh < -TOL) {
      violations.push(`Hour ${h}: battery_kwh (${entry.battery_kwh}) is negative.`);
    }

    // 3. Solar usage bound
    if (entry.solar_used_kwh > solarAvail + TOL) {
      violations.push(
        `Hour ${h}: solar_used_kwh (${entry.solar_used_kwh.toFixed(2)}) exceeds effective solar (${solarAvail.toFixed(2)}).`
      );
    }

    // 4. Rate limits
    const isCharge = entry.battery_action === "charge";
    const isDischarge = entry.battery_action === "discharge";
    const isIdle = entry.battery_action === "idle";

    if (isIdle && Math.abs(entry.battery_kwh) > TOL) {
      violations.push(`Hour ${h}: battery is idle but battery_kwh is non-zero (${entry.battery_kwh}).`);
    }

    if (isCharge && entry.battery_kwh > battery.max_charge_kwh_per_hour + TOL) {
      violations.push(
        `Hour ${h}: charge amount ${entry.battery_kwh.toFixed(2)} exceeds max_charge ${battery.max_charge_kwh_per_hour}.`
      );
    }

    if (isDischarge && entry.battery_kwh > battery.max_discharge_kwh_per_hour + TOL) {
      violations.push(
        `Hour ${h}: discharge amount ${entry.battery_kwh.toFixed(2)} exceeds max_discharge ${battery.max_discharge_kwh_per_hour}.`
      );
    }

    // 5. Energy balance: grid + solar_used + discharge = demand + charge
    const chargeKwh = isCharge ? entry.battery_kwh : 0;
    const dischargeKwh = isDischarge ? entry.battery_kwh : 0;
    const supply = entry.grid_kwh + entry.solar_used_kwh + dischargeKwh;
    const demandSide = reqHour.demand_kwh + chargeKwh;
    const balanceDelta = Math.abs(supply - demandSide);

    if (balanceDelta > TOL) {
      violations.push(
        `Hour ${h}: Energy balance violated! Supply (${supply.toFixed(3)}) != Demand+Charge (${demandSide.toFixed(3)}), delta = ${balanceDelta.toFixed(3)}.`
      );
    }

    // 6. Battery transition: E_after = E_before + charge - discharge
    const expectedEAfter = prevEnergy + chargeKwh - dischargeKwh;
    const transitionDelta = Math.abs(entry.battery_energy_after_kwh - expectedEAfter);
    if (transitionDelta > TOL) {
      violations.push(
        `Hour ${h}: Battery state transition mismatch. Expected ${expectedEAfter.toFixed(2)}, got ${entry.battery_energy_after_kwh.toFixed(2)}.`
      );
    }

    // 7. Battery capacity & reserve bounds
    const minReserve = minReserveByHour.get(h) ?? battery.minimum_energy_kwh;
    if (entry.battery_energy_after_kwh < minReserve - TOL) {
      violations.push(
        `Hour ${h}: Battery energy ${entry.battery_energy_after_kwh.toFixed(2)} drops below reserve requirement ${minReserve.toFixed(2)}.`
      );
    }

    if (entry.battery_energy_after_kwh > battery.capacity_kwh + TOL) {
      violations.push(
        `Hour ${h}: Battery energy ${entry.battery_energy_after_kwh.toFixed(2)} exceeds capacity ${battery.capacity_kwh.toFixed(2)}.`
      );
    }

    // 8. Directive windows
    if (noChargeHours.has(h) && isCharge && entry.battery_kwh > TOL) {
      violations.push(`Hour ${h}: Battery charged during active no_charge_window directive.`);
    }

    if (noDischargeHours.has(h) && isDischarge && entry.battery_kwh > TOL) {
      violations.push(`Hour ${h}: Battery discharged during active no_discharge_window directive.`);
    }

    const gridCap = maxGridByHour.get(h);
    if (gridCap !== undefined && entry.grid_kwh > gridCap + TOL) {
      violations.push(
        `Hour ${h}: Grid import (${entry.grid_kwh.toFixed(2)}) exceeds max_grid_window cap (${gridCap.toFixed(2)}).`
      );
    }

    prevEnergy = entry.battery_energy_after_kwh;
  }

  // 9. End-of-day battery neutrality: E_23 = initial_energy_kwh
  const finalEnergy = plan[23].battery_energy_after_kwh;
  const neutralityDelta = Math.abs(finalEnergy - battery.initial_energy_kwh);
  if (neutralityDelta > TOL) {
    violations.push(
      `End-of-day battery neutrality violated! E_23 (${finalEnergy.toFixed(2)}) != initial_energy (${battery.initial_energy_kwh.toFixed(2)}), delta = ${neutralityDelta.toFixed(3)}.`
    );
  }

  if (violations.length > 0) {
    throw new ReplayValidationError(violations);
  }
}
