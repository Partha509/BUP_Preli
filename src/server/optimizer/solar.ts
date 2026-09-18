import { DirectiveInterpretation, HourEntry } from "@/lib/types/gridwise";

/**
 * Computes effective solar generation for each of the 24 hours.
 * Directly implements Section 5.3:
 * For solar_reduction: effective_solar[h] = original_solar[h] * factor for each listed hour.
 */
export function computeEffectiveSolar(
  hours: HourEntry[],
  directives: DirectiveInterpretation[]
): number[] {
  const effectiveSolar = hours.map((h) => h.solar_kwh);

  // Apply all applicable solar_limit directives
  for (const dir of directives) {
    if (dir.applies && dir.directive_type === "solar_limit" && dir.structured_adjustment) {
      const { hours: affectedHours, factor } = dir.structured_adjustment as {
        hours: number[];
        factor: number;
      };
      if (Array.isArray(affectedHours) && typeof factor === "number") {
        for (const h of affectedHours) {
          if (h >= 0 && h < 24) {
            effectiveSolar[h] = effectiveSolar[h] * factor;
          }
        }
      }
    }
  }

  return effectiveSolar;
}
