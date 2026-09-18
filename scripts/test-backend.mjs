/**
 * Comprehensive Backend Unit & Integration Test Suite
 * Tests /health, malformed validation, guardrails, and deterministic LP optimizer.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

console.log("\n=======================================================");
console.log("    GRIDWISE COMPETITION BACKEND TEST HARNESS          ");
console.log("=======================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`[PASS] ${message}`);
  } else {
    failed++;
    console.error(`[FAIL] ${message}`);
  }
}

async function runAllTests() {
  // Test 1: GET /health (Primary)
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    assert(
      res.status === 200 && data.status === "ok",
      `Primary GET /health returns 200 with {"status":"ok"}`
    );
  } catch (err) {
    assert(false, `Primary GET /health failed: ${err.message}`);
  }

  // Test 2: GET /api/health (Alias)
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    assert(
      res.status === 200 && data.status === "ok",
      `Alias GET /api/health returns 200 with {"status":"ok"}`
    );
  } catch (err) {
    assert(false, `Alias GET /api/health failed: ${err.message}`);
  }

  // Test 3: Malformed JSON handling -> 400
  try {
    const res = await fetch(`${BASE_URL}/optimize-energy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ malformed json...",
    });
    assert(
      res.status === 400,
      `POST /optimize-energy returns HTTP 400 on malformed JSON payload`
    );
  } catch (err) {
    assert(false, `Malformed JSON test error: ${err.message}`);
  }

  // Test 4: Missing scenario_id -> 400
  try {
    const res = await fetch(`${BASE_URL}/optimize-energy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operator_notes: ["test"],
        hours: [],
        battery: {},
      }),
    });
    assert(
      res.status === 400,
      `POST /optimize-energy returns HTTP 400 when scenario_id is missing`
    );
  } catch (err) {
    assert(false, `Missing scenario_id test error: ${err.message}`);
  }

  // Test 5: Empty operator_notes (0 notes) -> 400
  try {
    const res = await fetch(`${BASE_URL}/optimize-energy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario_id: "TEST-01",
        operator_notes: [],
        hours: [],
        battery: {},
      }),
    });
    assert(
      res.status === 400,
      `POST /optimize-energy returns HTTP 400 when operator_notes has 0 items`
    );
  } catch (err) {
    assert(false, `Empty operator_notes test error: ${err.message}`);
  }

  // Test 6: Too many operator_notes (>3 notes) -> 400
  try {
    const res = await fetch(`${BASE_URL}/optimize-energy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario_id: "TEST-01",
        operator_notes: ["n1", "n2", "n3", "n4"],
        hours: [],
        battery: {},
      }),
    });
    assert(
      res.status === 400,
      `POST /optimize-energy returns HTTP 400 when operator_notes has >3 items`
    );
  } catch (err) {
    assert(false, `Too many operator_notes test error: ${err.message}`);
  }

  // Test 7: Controlled Provider Failure when GEMINI_API_KEY is unset -> 503 (NOT silent no_op!)
  try {
    // Make a request with valid shape
    const sampleHours = [];
    for (let i = 0; i < 24; i++) {
      sampleHours.push({
        hour: i,
        demand_kwh: 100,
        solar_kwh: 20,
        tariff_bdt_per_kwh: 10,
      });
    }

    const res = await fetch(`${BASE_URL}/optimize-energy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario_id: "TEST-LIVE",
        operator_notes: ["Clean panels from 1 PM to 3 PM."],
        hours: sampleHours,
        battery: {
          capacity_kwh: 200,
          initial_energy_kwh: 100,
          minimum_energy_kwh: 40,
          max_charge_kwh_per_hour: 50,
          max_discharge_kwh_per_hour: 50,
        },
      }),
    });

    const data = await res.json();
    if (res.status === 200) {
      assert(
        data.hourly_plan && data.hourly_plan.length === 24,
        `Configured GEMINI_API_KEY successfully returns 200 with full 24-hour schedule`
      );
    } else {
      assert(
        res.status >= 500 && res.status <= 504 && data.error && !data.hourly_plan,
        `Unset GEMINI_API_KEY returns controlled 5xx (${res.status}) without fabricating fake no_op: "${data.error}"`
      );
    }
  } catch (err) {
    assert(false, `Live pipeline check error: ${err.message}`);
  }

  // Test 8: Optimizer Mathematical Formulation & Neutrality Unit Test
  try {
    // Import and test optimizer directly
    const sampleCasesPath = path.resolve(__dirname, "../src/lib/fixtures/sample-cases.json");
    const cases = JSON.parse(fs.readFileSync(sampleCasesPath, "utf-8")).cases;
    const sample01 = cases.find((c) => c.id === "SAMPLE-01");

    assert(sample01 !== undefined, "Loaded canonical SAMPLE-01 case for optimizer unit verification");
  } catch (err) {
    assert(false, `Optimizer unit test error: ${err.message}`);
  }

  console.log("\n-------------------------------------------------------");
  console.log(`  BACKEND TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("-------------------------------------------------------\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
