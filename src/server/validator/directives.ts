import {
  BatteryParams,
  DirectiveInterpretation,
  DirectiveType,
  StructuredAdjustment,
} from "@/lib/types/gridwise";
import { RawDirectiveInterpretation } from "../llm/interpreter";

export class GuardrailError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 422) {
    super(message);
    this.name = "GuardrailError";
    this.statusCode = statusCode;
  }
}

const SUPPORTED_DIRECTIVES = new Set<DirectiveType>([
  "solar_reduction",
  "minimum_battery_reserve",
  "no_charge_window",
  "no_discharge_window",
  "max_grid_window",
  "no_op",
]);

/**
 * Validates and normalizes raw LLM output against deterministic competition guardrails.
 * Enforces exact note_index ordering, supported types, applies semantics, hours bounds, and numeric limits.
 */
export function validateAndGuardrailDirectives(
  rawInterpretations: RawDirectiveInterpretation[],
  operatorNotesCount: number,
  battery: BatteryParams
): DirectiveInterpretation[] {
  if (!Array.isArray(rawInterpretations)) {
    throw new GuardrailError(
      "LLM output must be an array of directive interpretation objects."
    );
  }

  // Create an array sorted by note_index
  const validated: DirectiveInterpretation[] = [];
  const seenNoteIndices = new Set<number>();

  // Build index map from raw interpretations
  const rawByIndex = new Map<number, RawDirectiveInterpretation>();
  for (const item of rawInterpretations) {
    if (typeof item.note_index === "number") {
      rawByIndex.set(item.note_index, item);
    }
  }

  for (let idx = 0; idx < operatorNotesCount; idx++) {
    const raw = rawByIndex.get(idx) || rawInterpretations[idx];

    if (!raw) {
      // Fallback safe failure for missing note index
      validated.push({
        note_index: idx,
        applies: false,
        directive_type: "no_op",
        structured_adjustment: null,
        explanation: "Operator note could not be mapped to an interpreted directive.",
      });
      continue;
    }

    seenNoteIndices.add(idx);

    // 1. Verify directive_type
    const dType = (raw.directive_type || "no_op") as DirectiveType;
    const finalType: DirectiveType = SUPPORTED_DIRECTIVES.has(dType) ? dType : "no_op";

    // 2. applies semantics
    // strictly: applies = false ONLY for no_op; applies = true for all others
    const applies = finalType !== "no_op";

    // 3. structured_adjustment validation
    let finalAdjustment: StructuredAdjustment = null;

    if (finalType === "no_op") {
      finalAdjustment = null;
    } else {
      const rawAdj = raw.structured_adjustment;
      if (!rawAdj || typeof rawAdj !== "object") {
        // Fallback to safe no_op if active directive lacks structured adjustment object
        validated.push({
          note_index: idx,
          applies: false,
          directive_type: "no_op",
          structured_adjustment: null,
          explanation: `Invalid structured adjustment provided for ${finalType}; rejected by deterministic guardrail.`,
        });
        continue;
      }

      // Validate hours: array of unique integers 0..23 in ascending order
      const rawHours = (rawAdj as any).hours;
      if (!Array.isArray(rawHours) || rawHours.length === 0) {
        validated.push({
          note_index: idx,
          applies: false,
          directive_type: "no_op",
          structured_adjustment: null,
          explanation: `Directive ${finalType} requires a non-empty 'hours' array.`,
        });
        continue;
      }

      const validHours: number[] = [];
      const seenH = new Set<number>();

      for (const h of rawHours) {
        if (typeof h === "number" && Number.isInteger(h) && h >= 0 && h <= 23) {
          if (!seenH.has(h)) {
            seenH.add(h);
            validHours.push(h);
          }
        }
      }

      validHours.sort((a, b) => a - b);

      if (validHours.length === 0) {
        validated.push({
          note_index: idx,
          applies: false,
          directive_type: "no_op",
          structured_adjustment: null,
          explanation: `Directive ${finalType} contains no valid hours in range [0, 23].`,
        });
        continue;
      }

      // Validate numeric parameters per directive type
      if (finalType === "solar_reduction") {
        let factor = Number((rawAdj as any).factor);
        if (isNaN(factor)) factor = 0.0;
        // Clamp factor strictly between 0 and 1
        factor = Math.max(0, Math.min(1, factor));
        finalAdjustment = { hours: validHours, factor };
      } else if (finalType === "minimum_battery_reserve") {
        let minEnergy = Number((rawAdj as any).minimum_energy_kwh);
        if (isNaN(minEnergy) || minEnergy < 0) minEnergy = battery.minimum_energy_kwh;
        // Clamp reserve to battery capacity
        minEnergy = Math.min(battery.capacity_kwh, Math.max(0, minEnergy));
        finalAdjustment = { hours: validHours, minimum_energy_kwh: minEnergy };
      } else if (finalType === "max_grid_window") {
        let maxGrid = Number((rawAdj as any).max_grid_kwh);
        if (isNaN(maxGrid) || maxGrid < 0) maxGrid = 0;
        finalAdjustment = { hours: validHours, max_grid_kwh: maxGrid };
      } else if (finalType === "no_charge_window" || finalType === "no_discharge_window") {
        finalAdjustment = { hours: validHours };
      }
    }

    validated.push({
      note_index: idx,
      applies,
      directive_type: finalType,
      structured_adjustment: finalAdjustment,
      explanation: raw.explanation || `Interpreted as ${finalType}.`,
    });
  }

  // Ensure returned in exact note_index order 0..N-1
  validated.sort((a, b) => a.note_index - b.note_index);
  return validated;
}
