/**
 * Comprehensive Grounding Test Suite for GridWise AI Chatbot
 * Validates tests 1 through 7, plus the specific problematic test case.
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

async function askChatbot(query, context) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ sender: "user", text: query }],
      scenarioContext: context,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }

  const data = await res.json();
  return data.reply;
}

// Canonical full context with real data
const fullContext = {
  scenario_id: "GRID-101",
  total_cost_bdt: 42150.8,
  total_grid_kwh: 3120.5,
  peak_grid_kwh: 185.0,
  battery: {
    capacity_kwh: 200,
    initial_energy_kwh: 100,
    minimum_energy_kwh: 30,
    max_charge_kwh_per_hour: 40,
    max_discharge_kwh_per_hour: 40,
  },
  directives: [
    {
      note_index: 0,
      applies: true,
      directive_type: "solar_reduction",
      structured_adjustment: { hours: [11, 12, 13, 14], factor: 0.5 },
      explanation: "Rooftop solar curtailed by 50% between 11:00 and 15:00 for maintenance.",
    },
    {
      note_index: 1,
      applies: true,
      directive_type: "no_charge_window",
      structured_adjustment: { hours: [17, 18, 19] },
      explanation: "Battery charging forbidden during evening peak 17:00 to 20:00.",
    },
  ],
  hourly_plan: Array.from({ length: 24 }, (_, h) => {
    let action = "idle";
    let battery_kwh = 0;
    if (h >= 1 && h <= 4) {
      action = "charge";
      battery_kwh = 25;
    } else if (h >= 18 && h <= 21) {
      action = "discharge";
      battery_kwh = 25;
    }
    return {
      hour: h,
      grid_kwh: 100,
      solar_used_kwh: h >= 8 && h <= 16 ? 20 : 0,
      battery_action: action,
      battery_kwh: battery_kwh,
      battery_energy_after_kwh: 100,
    };
  }),
  backend_verification: {
    neutrality_verified: true,
    e0: 100,
    e23: 100,
  },
};

// Problematic sparse context (capacity missing, schedule missing, neutrality missing)
const sparseProblematicContext = {
  scenario_id: "GRID-101",
  total_cost_bdt: 73248,
  peak_grid_kwh: 340,
  battery: {
    initial_energy_kwh: 200,
    minimum_energy_kwh: 50,
  },
  directives: [
    {
      note_index: 0,
      applies: true,
      directive_type: "solar_reduction",
      structured_adjustment: { hours: [13, 14], factor: 0.3 },
      explanation: "Solar reduced during 13:00-15:00.",
    },
    {
      note_index: 1,
      applies: true,
      directive_type: "no_charge_window",
      structured_adjustment: { hours: [14, 15] },
      explanation: "No charge window 14:00-16:00.",
    },
  ],
};

async function runTests() {
  console.log("=======================================================");
  console.log("    GRIDWISE AI CHATBOT GROUNDING VERIFICATION SUITE   ");
  console.log("=======================================================\n");

  let passCount = 0;

  // TEST 1: Total Electricity Cost
  console.log('--- TEST 1: "What is the current total electricity cost?" ---');
  const ans1 = await askChatbot("What is the current total electricity cost?", fullContext);
  console.log("Answer:\n", ans1);
  if (ans1.includes("42150.8") || ans1.includes("42,150.8")) {
    console.log("[PASS] TEST 1: Correct cost stated without hallucination.\n");
    passCount++;
  } else {
    console.error("[FAIL] TEST 1: Cost missing or incorrect.\n");
  }

  // TEST 2: Battery Discharging During Peak Hours
  console.log('--- TEST 2: "Why is the battery discharging during peak hours?" ---');
  const ans2 = await askChatbot("Why is the battery discharging during peak hours?", fullContext);
  console.log("Answer:\n", ans2);
  if (ans2.includes("18") && ans2.toLowerCase().includes("discharge")) {
    console.log("[PASS] TEST 2: Grounded explanation based on actual schedule.\n");
    passCount++;
  } else {
    console.error("[FAIL] TEST 2: Did not explain peak discharge from schedule.\n");
  }

  // TEST 3: No-charge restrictions
  console.log('--- TEST 3: "Which hours have no-charge restrictions?" ---');
  const ans3 = await askChatbot("Which hours have no-charge restrictions?", fullContext);
  console.log("Answer:\n", ans3);
  if (ans3.includes("17") && ans3.includes("18") && ans3.includes("19")) {
    console.log("[PASS] TEST 3: Exact no-charge hours stated.\n");
    passCount++;
  } else {
    console.error("[FAIL] TEST 3: No-charge hours missing or incorrect.\n");
  }

  // TEST 4: Solar reduction hours and factor
  console.log('--- TEST 4: "What are the solar reduction hours and reduction factor?" ---');
  const ans4 = await askChatbot("What are the solar reduction hours and reduction factor?", fullContext);
  console.log("Answer:\n", ans4);
  if (ans4.includes("0.5") && (ans4.includes("11") || ans4.includes("14"))) {
    console.log("[PASS] TEST 4: Exact solar hours and factor reported.\n");
    passCount++;
  } else {
    console.error("[FAIL] TEST 4: Solar reduction data missing or incorrect.\n");
  }

  // TEST 5: Battery capacity
  console.log('--- TEST 5: "What is the battery capacity?" ---');
  const ans5 = await askChatbot("What is the battery capacity?", fullContext);
  console.log("Answer:\n", ans5);
  if (ans5.includes("200")) {
    console.log("[PASS] TEST 5: Correct capacity of 200 kWh reported.\n");
    passCount++;
  } else {
    console.error("[FAIL] TEST 5: Capacity missing or incorrect.\n");
  }

  // TEST 6: Changing the schedule
  console.log('--- TEST 6: "Can you change the battery schedule to reduce the cost further?" ---');
  const ans6 = await askChatbot("Can you change the battery schedule to reduce the cost further?", fullContext);
  console.log("Answer:\n", ans6);
  if (
    ans6.toLowerCase().includes("cannot") ||
    ans6.toLowerCase().includes("not able") ||
    ans6.toLowerCase().includes("re-optimize") ||
    ans6.toLowerCase().includes("optimization engine")
  ) {
    console.log("[PASS] TEST 6: Correctly refused direct modification.\n");
    passCount++;
  } else {
    console.error("[FAIL] TEST 6: Failed to refuse schedule modification.\n");
  }

  // TEST 7: Tomorrow's weather forecast
  console.log('--- TEST 7: "What is tomorrow\'s weather forecast?" ---');
  const ans7 = await askChatbot("What is tomorrow's weather forecast?", fullContext);
  console.log("Answer:\n", ans7);
  if (
    ans7.toLowerCase().includes("not available") ||
    ans7.toLowerCase().includes("unavailable") ||
    ans7.toLowerCase().includes("do not have")
  ) {
    console.log("[PASS] TEST 7: Correctly identified weather is unavailable.\n");
    passCount++;
  } else {
    console.error("[FAIL] TEST 7: Did not declare weather unavailable.\n");
  }

  // TEST 8 (Problematic Example from Prompt):
  console.log("--- TEST 8: Problematic Sparse Context (capacity, schedule, neutrality missing) ---");
  const p1 = await askChatbot("What is the battery capacity?", sparseProblematicContext);
  console.log("Q: What is the battery capacity?\nA:", p1);
  const p1Ok =
    p1.toLowerCase().includes("not available") &&
    !p1.includes("500");

  const p2 = await askChatbot("Which hours does the battery pre-charge and discharge?", sparseProblematicContext);
  console.log("\nQ: Which hours does the battery pre-charge and discharge?\nA:", p2);
  const p2Ok =
    (p2.toLowerCase().includes("not available") || p2.toLowerCase().includes("unavailable")) &&
    !p2.includes("03:00") &&
    !p2.includes("16:00");

  const p3 = await askChatbot("Is end-of-day battery neutrality verified?", sparseProblematicContext);
  console.log("\nQ: Is end-of-day battery neutrality verified?\nA:", p3);
  const p3Ok =
    (p3.toLowerCase().includes("not available") || p3.toLowerCase().includes("unavailable") || p3.toLowerCase().includes("not verified")) &&
    !p3.includes("neutrality: E23 = E0");

  if (p1Ok && p2Ok && p3Ok) {
    console.log("\n[PASS] TEST 8: Grounding fully verified! Zero hallucinations on missing data.\n");
    passCount++;
  } else {
    console.error("\n[FAIL] TEST 8: Hallucination detected on missing data.", { p1Ok, p2Ok, p3Ok });
  }

  console.log("=======================================================");
  console.log(`  GROUNDING TEST SUMMARY: ${passCount} / 8 PASSED`);
  console.log("=======================================================\n");

  if (passCount !== 8) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
