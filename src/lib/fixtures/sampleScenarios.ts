import sampleCasesData from "./sample-cases.json";
import {
  OptimizeEnergyRequest,
  OptimizeEnergyResponse,
  PublicSampleCase,
} from "@/lib/types/gridwise";

export const SAMPLE_CASES: PublicSampleCase[] = (sampleCasesData as any).cases;

/**
 * Canonical GRID-101 scenario from Problem Statement Section 7.4
 */
export const GRID_101_REQUEST: OptimizeEnergyRequest = {
  scenario_id: "GRID-101",
  operator_notes: [
    "Solar output will drop to about 20% from 1 PM to 3 PM.",
    "Do not charge the battery between 2 PM and 4 PM.",
    "The cafeteria menu changes tomorrow.",
  ],
  hours: [
    { hour: 0, demand_kwh: 180, solar_kwh: 0, tariff_bdt_per_kwh: 7 },
    { hour: 1, demand_kwh: 170, solar_kwh: 0, tariff_bdt_per_kwh: 6 },
    { hour: 2, demand_kwh: 160, solar_kwh: 0, tariff_bdt_per_kwh: 6 },
    { hour: 3, demand_kwh: 160, solar_kwh: 0, tariff_bdt_per_kwh: 5 },
    { hour: 4, demand_kwh: 165, solar_kwh: 0, tariff_bdt_per_kwh: 5 },
    { hour: 5, demand_kwh: 175, solar_kwh: 0, tariff_bdt_per_kwh: 6 },
    { hour: 6, demand_kwh: 200, solar_kwh: 10, tariff_bdt_per_kwh: 8 },
    { hour: 7, demand_kwh: 240, solar_kwh: 35, tariff_bdt_per_kwh: 10 },
    { hour: 8, demand_kwh: 280, solar_kwh: 90, tariff_bdt_per_kwh: 12 },
    { hour: 9, demand_kwh: 310, solar_kwh: 160, tariff_bdt_per_kwh: 14 },
    { hour: 10, demand_kwh: 330, solar_kwh: 240, tariff_bdt_per_kwh: 16 },
    { hour: 11, demand_kwh: 340, solar_kwh: 300, tariff_bdt_per_kwh: 16 },
    { hour: 12, demand_kwh: 350, solar_kwh: 340, tariff_bdt_per_kwh: 15 },
    { hour: 13, demand_kwh: 340, solar_kwh: 320, tariff_bdt_per_kwh: 14 },
    { hour: 14, demand_kwh: 320, solar_kwh: 260, tariff_bdt_per_kwh: 13 },
    { hour: 15, demand_kwh: 310, solar_kwh: 170, tariff_bdt_per_kwh: 14 },
    { hour: 16, demand_kwh: 320, solar_kwh: 85, tariff_bdt_per_kwh: 18 },
    { hour: 17, demand_kwh: 350, solar_kwh: 20, tariff_bdt_per_kwh: 22 },
    { hour: 18, demand_kwh: 390, solar_kwh: 0, tariff_bdt_per_kwh: 28 },
    { hour: 19, demand_kwh: 410, solar_kwh: 0, tariff_bdt_per_kwh: 30 },
    { hour: 20, demand_kwh: 390, solar_kwh: 0, tariff_bdt_per_kwh: 26 },
    { hour: 21, demand_kwh: 330, solar_kwh: 0, tariff_bdt_per_kwh: 18 },
    { hour: 22, demand_kwh: 260, solar_kwh: 0, tariff_bdt_per_kwh: 11 },
    { hour: 23, demand_kwh: 200, solar_kwh: 0, tariff_bdt_per_kwh: 9 },
  ],
  battery: {
    capacity_kwh: 500,
    initial_energy_kwh: 200,
    minimum_energy_kwh: 50,
    max_charge_kwh_per_hour: 100,
    max_discharge_kwh_per_hour: 100,
  },
};

/**
 * Pre-computed canonical mock response for GRID-101 (offline UI development)
 */
export const GRID_101_RESPONSE: OptimizeEnergyResponse = {
  scenario_id: "GRID-101",
  directive_interpretation: [
    {
      note_index: 0,
      applies: true,
      directive_type: "solar_limit",
      structured_adjustment: {
        hours: [13, 14],
        factor: 0.2,
      },
      explanation: "Solar output reduced to 20% during panel maintenance window (1 PM to 3 PM).",
    },
    {
      note_index: 1,
      applies: true,
      directive_type: "battery_charge_limit",
      structured_adjustment: {
        hours: [14, 15],
      },
      explanation: "Battery charging locked out during 2 PM to 4 PM electrical inspection.",
    },
    {
      note_index: 2,
      applies: false,
      directive_type: "no_op",
      structured_adjustment: null,
      explanation: "Cafeteria menu update is irrelevant to the 24-hour campus energy schedule.",
    },
  ],
  hourly_plan: [
    { hour: 0, grid_kwh: 180, solar_used_kwh: 0, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 200 },
    { hour: 1, grid_kwh: 170, solar_used_kwh: 0, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 200 },
    { hour: 2, grid_kwh: 160, solar_used_kwh: 0, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 200 },
    { hour: 3, grid_kwh: 260, solar_used_kwh: 0, battery_action: "charge", battery_kwh: 100, battery_energy_after_kwh: 300 },
    { hour: 4, grid_kwh: 265, solar_used_kwh: 0, battery_action: "charge", battery_kwh: 100, battery_energy_after_kwh: 400 },
    { hour: 5, grid_kwh: 275, solar_used_kwh: 0, battery_action: "charge", battery_kwh: 100, battery_energy_after_kwh: 500 },
    { hour: 6, grid_kwh: 190, solar_used_kwh: 10, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 500 },
    { hour: 7, grid_kwh: 205, solar_used_kwh: 35, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 500 },
    { hour: 8, grid_kwh: 190, solar_used_kwh: 90, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 500 },
    { hour: 9, grid_kwh: 150, solar_used_kwh: 160, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 500 },
    { hour: 10, grid_kwh: 90, solar_used_kwh: 240, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 500 },
    { hour: 11, grid_kwh: 40, solar_used_kwh: 300, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 500 },
    { hour: 12, grid_kwh: 10, solar_used_kwh: 340, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 500 },
    { hour: 13, grid_kwh: 276, solar_used_kwh: 64, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 500 },
    { hour: 14, grid_kwh: 268, solar_used_kwh: 52, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 500 },
    { hour: 15, grid_kwh: 140, solar_used_kwh: 170, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 500 },
    { hour: 16, grid_kwh: 135, solar_used_kwh: 85, battery_action: "discharge", battery_kwh: 100, battery_energy_after_kwh: 400 },
    { hour: 17, grid_kwh: 230, solar_used_kwh: 20, battery_action: "discharge", battery_kwh: 100, battery_energy_after_kwh: 300 },
    { hour: 18, grid_kwh: 290, solar_used_kwh: 0, battery_action: "discharge", battery_kwh: 100, battery_energy_after_kwh: 200 },
    { hour: 19, grid_kwh: 310, solar_used_kwh: 0, battery_action: "discharge", battery_kwh: 100, battery_energy_after_kwh: 100 },
    { hour: 20, grid_kwh: 340, solar_used_kwh: 0, battery_action: "discharge", battery_kwh: 50, battery_energy_after_kwh: 50 },
    { hour: 21, grid_kwh: 330, solar_used_kwh: 0, battery_action: "idle", battery_kwh: 0, battery_energy_after_kwh: 50 },
    { hour: 22, grid_kwh: 310, solar_used_kwh: 0, battery_action: "charge", battery_kwh: 50, battery_energy_after_kwh: 100 },
    { hour: 23, grid_kwh: 300, solar_used_kwh: 0, battery_action: "charge", battery_kwh: 100, battery_energy_after_kwh: 200 },
  ],
  total_grid_kwh: 4944,
  total_cost_bdt: 73248,
  peak_grid_kwh: 340,
  plan_summary: "Cuts midday solar to 20% in hours 13-14, honors no-charge window in hours 14-15, pre-charges battery during off-peak morning hours (3-5 AM) and discharges during expensive evening peak tariff hours (16-20 PM) to minimize cost while strictly restoring end-of-day battery neutrality (200 kWh).",
};

/**
 * Retrieve a sample scenario input payload by ID (e.g. 'GRID-101' or 'SAMPLE-01')
 */
export function getSampleScenario(id: string): OptimizeEnergyRequest | undefined {
  if (id.toUpperCase() === "GRID-101") {
    return JSON.parse(JSON.stringify(GRID_101_REQUEST));
  }
  const found = SAMPLE_CASES.find((c) => c.id.toUpperCase() === id.toUpperCase());
  return found ? JSON.parse(JSON.stringify(found.input)) : undefined;
}

/**
 * Retrieve the canonical expected output for offline UI development only
 */
export function getSampleExpectedOutput(
  id: string
): OptimizeEnergyResponse | undefined {
  if (id.toUpperCase() === "GRID-101") {
    return JSON.parse(JSON.stringify(GRID_101_RESPONSE));
  }
  const found = SAMPLE_CASES.find((c) => c.id.toUpperCase() === id.toUpperCase());
  return found ? JSON.parse(JSON.stringify(found.expected_output)) : undefined;
}

/**
 * List all available sample scenarios with descriptive metadata
 */
export function listSampleScenarios(): Array<{
  id: string;
  label: string;
  notesCount: number;
  rationale: string;
}> {
  const baseList = [
    {
      id: "GRID-101",
      label: "Problem Statement Canonical Case (Solar Reduction + No-Charge + Menu Distractor)",
      notesCount: GRID_101_REQUEST.operator_notes.length,
      rationale: "Official canonical case from Problem Statement Section 7.4.",
    },
  ];

  const packList = SAMPLE_CASES.map((c) => ({
    id: c.id,
    label: `${c.id}: ${c.label}`,
    notesCount: c.input.operator_notes.length,
    rationale: c.rationale,
  }));

  return [...baseList, ...packList];
}

/**
 * Default starter scenario (GRID-101)
 */
export const DEFAULT_SCENARIO_INPUT: OptimizeEnergyRequest = GRID_101_REQUEST;
export const DEFAULT_MOCK_RESPONSE: OptimizeEnergyResponse = GRID_101_RESPONSE;
