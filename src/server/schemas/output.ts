import {
  OptimizeEnergyResponse,
  DirectiveInterpretation,
  HourlyPlanEntry,
} from "@/lib/types/gridwise";

export function validateOptimizeEnergyResponse(
  res: unknown
): OptimizeEnergyResponse {
  if (!res || typeof res !== "object" || Array.isArray(res)) {
    throw new Error("Response must be a valid JSON object.");
  }

  const r = res as Record<string, unknown>;

  if (typeof r.scenario_id !== "string") {
    throw new Error("Missing or invalid scenario_id in response.");
  }

  if (!Array.isArray(r.directive_interpretation)) {
    throw new Error("Missing or invalid directive_interpretation in response.");
  }

  if (!Array.isArray(r.hourly_plan) || r.hourly_plan.length !== 24) {
    throw new Error("Response hourly_plan must contain exactly 24 entries.");
  }

  if (typeof r.total_grid_kwh !== "number" || !Number.isFinite(r.total_grid_kwh)) {
    throw new Error("Invalid total_grid_kwh in response.");
  }

  if (typeof r.total_cost_bdt !== "number" || !Number.isFinite(r.total_cost_bdt)) {
    throw new Error("Invalid total_cost_bdt in response.");
  }

  if (typeof r.peak_grid_kwh !== "number" || !Number.isFinite(r.peak_grid_kwh)) {
    throw new Error("Invalid peak_grid_kwh in response.");
  }

  if (typeof r.plan_summary !== "string") {
    throw new Error("Missing or invalid plan_summary string in response.");
  }

  return r as unknown as OptimizeEnergyResponse;
}
