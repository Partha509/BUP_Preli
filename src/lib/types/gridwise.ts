/**
 * GridWise Canonical Schema & Domain Types
 * Matches BUP CSE Fest 2026 Hackathon Problem Statement Specifications
 */

export type DirectiveType =
  | "solar_reduction"
  | "minimum_battery_reserve"
  | "no_charge_window"
  | "no_discharge_window"
  | "max_grid_window"
  | "no_op";

export type BatteryAction = "charge" | "discharge" | "idle";

/**
 * 24-hour interval entry for demand, solar, and Time-of-Use tariff
 */
export interface HourEntry {
  hour: number; // 0 to 23
  demand_kwh: number;
  solar_kwh: number;
  tariff_bdt_per_kwh: number;
}

/**
 * Hardware bounds and parameters for Battery Energy Storage System (BESS)
 */
export interface BatteryParams {
  capacity_kwh: number;
  initial_energy_kwh: number;
  minimum_energy_kwh: number;
  max_charge_kwh_per_hour: number;
  max_discharge_kwh_per_hour: number;
}

/**
 * Request payload for POST /optimize-energy (Section 07)
 */
export interface OptimizeEnergyRequest {
  scenario_id: string;
  operator_notes: string[]; // 1 to 3 non-empty strings
  hours: HourEntry[]; // exactly 24 entries (0..23)
  battery: BatteryParams;
}

/**
 * Structured adjustments for directives (Section 04)
 */
export interface SolarReductionAdjustment {
  hours: number[]; // unique ascending integers 0..23
  factor: number; // 0.0 to 1.0 usable fraction remaining
}

export interface MinimumBatteryReserveAdjustment {
  hours: number[]; // unique ascending integers 0..23
  minimum_energy_kwh: number; // non-negative finite <= capacity
}

export interface WindowAdjustment {
  hours: number[]; // unique ascending integers 0..23
}

export interface MaxGridWindowAdjustment {
  hours: number[]; // unique ascending integers 0..23
  max_grid_kwh: number; // non-negative finite
}

export type StructuredAdjustment =
  | SolarReductionAdjustment
  | MinimumBatteryReserveAdjustment
  | WindowAdjustment
  | MaxGridWindowAdjustment
  | null;

/**
 * Machine-checkable interpretation for each operator note (Section 10.2)
 */
export interface DirectiveInterpretation {
  note_index: number; // 0-based index matching operator_notes
  applies: boolean; // false only for no_op, true for all others
  directive_type: DirectiveType;
  structured_adjustment: StructuredAdjustment; // null only for no_op
  explanation: string;
}

/**
 * Hourly dispatch schedule produced by the backend optimizer (Section 10.3)
 */
export interface HourlyPlanEntry {
  hour: number; // 0 to 23
  grid_kwh: number;
  solar_used_kwh: number;
  battery_action: BatteryAction;
  battery_kwh: number;
  battery_energy_after_kwh: number;
}

/**
 * Response payload from POST /optimize-energy (Section 10.1)
 */
export interface OptimizeEnergyResponse {
  scenario_id: string;
  directive_interpretation: DirectiveInterpretation[];
  hourly_plan: HourlyPlanEntry[]; // exactly 24 entries
  total_grid_kwh: number;
  total_cost_bdt: number;
  peak_grid_kwh: number;
  plan_summary: string;
}

/**
 * Readiness response from GET /health (Section 06.2)
 */
export interface HealthResponse {
  status: "ok";
}

/**
 * Public Worked Sample Case Structure from the Official Document Pack
 */
export interface PublicSampleCase {
  id: string;
  label: string;
  input: OptimizeEnergyRequest;
  expected_output: OptimizeEnergyResponse;
  rationale: string;
}
