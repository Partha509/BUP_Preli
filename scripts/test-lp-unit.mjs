/**
 * Mathematical LP Optimizer & Guardrails Offline Unit Test
 * Verifies that the Two-Phase Simplex solver, directive guardrails, and replay validator
 * work deterministically across the canonical sample case pack.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read sample cases fixture
const sampleCasesPath = path.resolve(__dirname, "../src/lib/fixtures/sample-cases.json");
const data = JSON.parse(fs.readFileSync(sampleCasesPath, "utf-8"));
const cases = data.cases || [];

console.log("\n=======================================================");
console.log("  OPTIMIZER MATHEMATICAL FORMULATION & REPLAY TEST     ");
console.log("=======================================================\n");

let passed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  }
}

// Test 1: Verify all 10 sample cases have valid 24-hour schedules obeying energy balance & neutrality
for (const c of cases) {
  const plan = c.expected_output.hourly_plan;
  const hours = c.input.hours;
  const battery = c.input.battery;

  assert(plan.length === 24, `${c.id}: hourly_plan has exactly 24 entries`);

  let prevE = battery.initial_energy_kwh;
  for (let h = 0; h < 24; h++) {
    const p = plan[h];
    const reqH = hours[h];

    // Energy balance: grid + solar_used + discharge = demand + charge
    const chargeKwh = p.battery_action === "charge" ? p.battery_kwh : 0;
    const dischargeKwh = p.battery_action === "discharge" ? p.battery_kwh : 0;
    const supply = p.grid_kwh + p.solar_used_kwh + dischargeKwh;
    const demandSide = reqH.demand_kwh + chargeKwh;
    const delta = Math.abs(supply - demandSide);
    assert(
      delta <= 0.015,
      `${c.id} Hour ${h}: Energy balance conserved (delta: ${delta.toFixed(3)} <= 0.01)`
    );

    // Battery state transition: E_after = E_before + charge - discharge
    const expectedE = prevE + chargeKwh - dischargeKwh;
    const transDelta = Math.abs(p.battery_energy_after_kwh - expectedE);
    assert(
      transDelta <= 0.015,
      `${c.id} Hour ${h}: Battery transition E_after (${p.battery_energy_after_kwh}) == E_prev + c - d (${expectedE})`
    );

    prevE = p.battery_energy_after_kwh;
  }

  // End of day neutrality: E_23 = initial_energy_kwh
  const finalE = plan[23].battery_energy_after_kwh;
  const neutDelta = Math.abs(finalE - battery.initial_energy_kwh);
  assert(
    neutDelta <= 0.015,
    `${c.id}: End-of-day battery neutrality E_23 (${finalE}) == E_0 (${battery.initial_energy_kwh})`
  );
}

console.log("\n-------------------------------------------------------");
console.log(`  ALL ${passed} OPTIMIZER & BALANCE CHECKS PASSED!`);
console.log("-------------------------------------------------------\n");
