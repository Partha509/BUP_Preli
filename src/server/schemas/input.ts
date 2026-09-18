import {
  OptimizeEnergyRequest,
  HourEntry,
  BatteryParams,
} from "@/lib/types/gridwise";

export class ValidationError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = statusCode;
  }
}

export function validateOptimizeEnergyRequest(data: unknown): OptimizeEnergyRequest {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ValidationError("Request body must be a valid JSON object.");
  }

  const raw = data as Record<string, unknown>;

  // 1. scenario_id
  if (typeof raw.scenario_id !== "string" || raw.scenario_id.trim().length === 0) {
    throw new ValidationError(
      "Field 'scenario_id' is required and must be a non-empty string."
    );
  }

  // 2. operator_notes: 1 to 3 non-empty strings
  if (!Array.isArray(raw.operator_notes)) {
    throw new ValidationError(
      "Field 'operator_notes' is required and must be an array of 1 to 3 strings."
    );
  }

  if (raw.operator_notes.length < 1 || raw.operator_notes.length > 3) {
    throw new ValidationError(
      `Field 'operator_notes' must contain between 1 and 3 items. Received ${raw.operator_notes.length}.`
    );
  }

  const cleanNotes: string[] = [];
  for (let i = 0; i < raw.operator_notes.length; i++) {
    const note = raw.operator_notes[i];
    if (typeof note !== "string" || note.trim().length === 0) {
      throw new ValidationError(
        `operator_notes[${i}] must be a non-empty string.`
      );
    }
    cleanNotes.push(note.trim());
  }

  // 3. hours: exactly 24 entries, unique 0..23
  if (!Array.isArray(raw.hours)) {
    throw new ValidationError(
      "Field 'hours' is required and must be an array of 24 hourly objects."
    );
  }

  if (raw.hours.length !== 24) {
    throw new ValidationError(
      `Field 'hours' must contain exactly 24 hourly entries. Received ${raw.hours.length}.`
    );
  }

  const cleanHours: HourEntry[] = [];
  const seenHours = new Set<number>();

  for (let i = 0; i < raw.hours.length; i++) {
    const h = raw.hours[i];
    if (!h || typeof h !== "object") {
      throw new ValidationError(`hours[${i}] must be an object.`);
    }

    const { hour, demand_kwh, solar_kwh, tariff_bdt_per_kwh } = h as Record<
      string,
      unknown
    >;

    if (
      typeof hour !== "number" ||
      !Number.isInteger(hour) ||
      hour < 0 ||
      hour > 23
    ) {
      throw new ValidationError(
        `hours[${i}].hour must be an integer between 0 and 23.`
      );
    }

    if (seenHours.has(hour)) {
      throw new ValidationError(`Duplicate hour ${hour} found in 'hours' array.`);
    }
    seenHours.add(hour);

    if (
      typeof demand_kwh !== "number" ||
      !Number.isFinite(demand_kwh) ||
      demand_kwh < 0
    ) {
      throw new ValidationError(
        `hours[${i}].demand_kwh must be a non-negative finite number.`
      );
    }

    if (
      typeof solar_kwh !== "number" ||
      !Number.isFinite(solar_kwh) ||
      solar_kwh < 0
    ) {
      throw new ValidationError(
        `hours[${i}].solar_kwh must be a non-negative finite number.`
      );
    }

    if (
      typeof tariff_bdt_per_kwh !== "number" ||
      !Number.isFinite(tariff_bdt_per_kwh) ||
      tariff_bdt_per_kwh < 0
    ) {
      throw new ValidationError(
        `hours[${i}].tariff_bdt_per_kwh must be a non-negative finite number.`
      );
    }

    cleanHours.push({
      hour,
      demand_kwh,
      solar_kwh,
      tariff_bdt_per_kwh,
    });
  }

  // Sort hours in ascending order (0..23)
  cleanHours.sort((a, b) => a.hour - b.hour);
  for (let i = 0; i < 24; i++) {
    if (cleanHours[i].hour !== i) {
      throw new ValidationError(
        `'hours' array must contain all 24 hours from 0 through 23 without missing intervals.`
      );
    }
  }

  // 4. battery object
  if (!raw.battery || typeof raw.battery !== "object") {
    throw new ValidationError(
      "Field 'battery' is required and must be an object with storage parameters."
    );
  }

  const b = raw.battery as Record<string, unknown>;

  const capacity_kwh = b.capacity_kwh;
  const initial_energy_kwh = b.initial_energy_kwh;
  const minimum_energy_kwh = b.minimum_energy_kwh;
  const max_charge_kwh_per_hour = b.max_charge_kwh_per_hour;
  const max_discharge_kwh_per_hour = b.max_discharge_kwh_per_hour;

  if (
    typeof capacity_kwh !== "number" ||
    !Number.isFinite(capacity_kwh) ||
    capacity_kwh <= 0
  ) {
    throw new ValidationError(
      "battery.capacity_kwh must be a positive finite number."
    );
  }

  if (
    typeof initial_energy_kwh !== "number" ||
    !Number.isFinite(initial_energy_kwh) ||
    initial_energy_kwh < 0 ||
    initial_energy_kwh > capacity_kwh
  ) {
    throw new ValidationError(
      "battery.initial_energy_kwh must be a finite number between 0 and capacity_kwh."
    );
  }

  if (
    typeof minimum_energy_kwh !== "number" ||
    !Number.isFinite(minimum_energy_kwh) ||
    minimum_energy_kwh < 0 ||
    minimum_energy_kwh > capacity_kwh
  ) {
    throw new ValidationError(
      "battery.minimum_energy_kwh must be a finite number between 0 and capacity_kwh."
    );
  }

  if (
    typeof max_charge_kwh_per_hour !== "number" ||
    !Number.isFinite(max_charge_kwh_per_hour) ||
    max_charge_kwh_per_hour < 0
  ) {
    throw new ValidationError(
      "battery.max_charge_kwh_per_hour must be a non-negative finite number."
    );
  }

  if (
    typeof max_discharge_kwh_per_hour !== "number" ||
    !Number.isFinite(max_discharge_kwh_per_hour) ||
    max_discharge_kwh_per_hour < 0
  ) {
    throw new ValidationError(
      "battery.max_discharge_kwh_per_hour must be a non-negative finite number."
    );
  }

  const cleanBattery: BatteryParams = {
    capacity_kwh,
    initial_energy_kwh,
    minimum_energy_kwh,
    max_charge_kwh_per_hour,
    max_discharge_kwh_per_hour,
  };

  return {
    scenario_id: raw.scenario_id.trim(),
    operator_notes: cleanNotes,
    hours: cleanHours,
    battery: cleanBattery,
  };
}
