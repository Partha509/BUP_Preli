import { BatteryParams, DirectiveInterpretation } from "@/lib/types/gridwise";
import { buildDirectiveInterpretationPrompt } from "./prompt";

export class LlmProviderError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(
    message: string,
    statusCode: number = 502,
    details?: unknown
  ) {
    super(message);
    this.name = "LlmProviderError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export interface RawDirectiveInterpretation {
  note_index: number;
  applies: boolean;
  directive_type: string;
  structured_adjustment: Record<string, unknown> | null;
  explanation: string;
}

const DEFAULT_MODEL = "gemini-flash-lite-latest";
const DEFAULT_TIMEOUT_MS = 25000;
const MAX_RETRIES = 2;

const SUPPORTED_DIRECTIVE_TYPES = new Set([
  "no_op",
  "grid_import_limit",
  "battery_soc_target",
  "battery_charge_limit",
  "battery_discharge_limit",
  "solar_limit",
]);

/**
 * Reads Gemini configuration from environment variables.
 */
function getGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new LlmProviderError(
      "GEMINI_API_KEY is not configured on the server.",
      503
    );
  }

  const model =
    process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;

  return {
    apiKey,
    model,
  };
}

/**
 * Creates the Gemini API endpoint.
 */
function buildGeminiEndpoint(
  model: string,
  apiKey: string
): string {
  return (
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${encodeURIComponent(model)}:generateContent` +
    `?key=${encodeURIComponent(apiKey)}`
  );
}

/**
 * Extracts the generated text from Gemini response.
 */
function extractGeminiText(data: unknown): string {
  const text =
    (data as any)?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text || typeof text !== "string") {
    throw new LlmProviderError(
      "Gemini returned an empty or invalid response.",
      502,
      data
    );
  }

  return text.trim();
}

/**
 * Parses JSON returned by Gemini.
 */
function parseGeminiJson(rawText: string): unknown {
  let cleaned = rawText.trim();

  // Remove Markdown code fences.
  cleaned = cleaned
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown JSON parsing error";

    throw new LlmProviderError(
      `Failed to parse Gemini response as JSON: ${message}`,
      502,
      {
        rawText,
      }
    );
  }
}

/**
 * Validates a single directive returned by the LLM.
 *
 * Important:
 * We never blindly trust the LLM output.
 */
function validateDirective(
  value: unknown,
  expectedIndex: number
): RawDirectiveInterpretation {
  if (!value || typeof value !== "object") {
    throw new LlmProviderError(
      `Invalid directive returned for note ${expectedIndex}.`,
      502,
      value
    );
  }

  const item = value as Record<string, unknown>;

  if (
    typeof item.note_index !== "number" ||
    !Number.isInteger(item.note_index)
  ) {
    throw new LlmProviderError(
      `Invalid note_index for note ${expectedIndex}.`,
      502,
      item
    );
  }

  if (item.note_index !== expectedIndex) {
    throw new LlmProviderError(
      `Gemini returned incorrect note_index. Expected ${expectedIndex}, received ${item.note_index}.`,
      502,
      item
    );
  }

  const applies = item.applies;

  if (typeof applies !== "boolean") {
    throw new LlmProviderError(
      `Invalid applies value for note ${expectedIndex}.`,
      502,
      item
    );
  }

  if (typeof item.directive_type !== "string") {
    throw new LlmProviderError(
      `Missing directive_type for note ${expectedIndex}.`,
      502,
      item
    );
  }

  const directiveType = item.directive_type.trim();

  if (!SUPPORTED_DIRECTIVE_TYPES.has(directiveType)) {
    throw new LlmProviderError(
      `Unsupported directive type "${directiveType}" for note ${expectedIndex}.`,
      502,
      item
    );
  }

  if (
    item.structured_adjustment !== null &&
    typeof item.structured_adjustment !== "object"
  ) {
    throw new LlmProviderError(
      `Invalid structured_adjustment for note ${expectedIndex}.`,
      502,
      item
    );
  }

  if (typeof item.explanation !== "string") {
    throw new LlmProviderError(
      `Missing explanation for note ${expectedIndex}.`,
      502,
      item
    );
  }

  return {
    note_index: item.note_index,
    applies,
    directive_type: directiveType,
    structured_adjustment:
      item.structured_adjustment as Record<string, unknown> | null,
    explanation: item.explanation.trim(),
  };
}

/**
 * Validates the complete Gemini response.
 *
 * Every operator note must have exactly one interpretation.
 */
function validateDirectiveResponse(
  parsed: unknown,
  noteCount: number
): RawDirectiveInterpretation[] {
  if (!Array.isArray(parsed)) {
    throw new LlmProviderError(
      "Gemini response must be a JSON array.",
      502,
      parsed
    );
  }

  if (parsed.length !== noteCount) {
    throw new LlmProviderError(
      `Gemini returned ${parsed.length} interpretations for ${noteCount} notes.`,
      502,
      parsed
    );
  }

  const directives: RawDirectiveInterpretation[] = [];

  for (let i = 0; i < parsed.length; i++) {
    directives.push(validateDirective(parsed[i], i));
  }

  // Make sure note indexes are unique.
  const indexes = new Set<number>();

  for (const directive of directives) {
    if (indexes.has(directive.note_index)) {
      throw new LlmProviderError(
        `Duplicate interpretation for note ${directive.note_index}.`,
        502,
        parsed
      );
    }

    indexes.add(directive.note_index);
  }

  return directives;
}

/**
 * Sleep helper used for retry backoff.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Performs one Gemini HTTP request.
 */
async function callGemini(
  endpoint: string,
  prompt: string,
  timeoutMs: number
): Promise<unknown> {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),

      signal: controller.signal,
    });

    let responseBody: unknown = null;

    try {
      responseBody = await response.json();
    } catch {
      responseBody = null;
    }

    if (!response.ok) {
      const errorMessage =
        (responseBody as any)?.error?.message ||
        `Gemini API returned ${response.status}.`;

      if (response.status === 429) {
        throw new LlmProviderError(
          `Gemini rate limit exceeded: ${errorMessage}`,
          429,
          responseBody
        );
      }

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new LlmProviderError(
          "Gemini authentication failed. Check GEMINI_API_KEY.",
          503,
          responseBody
        );
      }

      if (response.status >= 500) {
        throw new LlmProviderError(
          `Gemini service error: ${errorMessage}`,
          502,
          responseBody
        );
      }

      throw new LlmProviderError(
        `Gemini request failed: ${errorMessage}`,
        502,
        responseBody
      );
    }

    return responseBody;
  } catch (error: unknown) {
    if (error instanceof LlmProviderError) {
      throw error;
    }

    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new LlmProviderError(
        `Gemini request timed out after ${timeoutMs / 1000
        } seconds.`,
        504
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unknown network failure.";

    throw new LlmProviderError(
      `Failed to communicate with Gemini: ${message}`,
      502
    );
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Calls Gemini to interpret operator notes.
 *
 * Flow:
 *
 * operator notes
 *      ↓
 * Gemini
 *      ↓
 * JSON
 *      ↓
 * schema validation
 *      ↓
 * validated directives
 */
export async function interpretOperatorNotesWithLlm(
  operatorNotes: string[],
  battery: BatteryParams,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<RawDirectiveInterpretation[]> {
  if (!Array.isArray(operatorNotes)) {
    throw new LlmProviderError(
      "operatorNotes must be an array.",
      400
    );
  }

  if (operatorNotes.length === 0) {
    return [];
  }

  if (operatorNotes.length > 100) {
    throw new LlmProviderError(
      "Too many operator notes. Maximum allowed is 100.",
      400
    );
  }

  const cleanedNotes = operatorNotes.map((note, index) => {
    if (typeof note !== "string") {
      throw new LlmProviderError(
        `Operator note ${index} must be a string.`,
        400
      );
    }

    const cleaned = note.trim();

    if (cleaned.length === 0) {
      throw new LlmProviderError(
        `Operator note ${index} cannot be empty.`,
        400
      );
    }

    if (cleaned.length > 2000) {
      throw new LlmProviderError(
        `Operator note ${index} is too long. Maximum length is 2000 characters.`,
        400
      );
    }

    return cleaned;
  });

  const { apiKey, model } = getGeminiConfig();

  const prompt = buildDirectiveInterpretationPrompt(
    cleanedNotes,
    battery
  );

  const endpoint = buildGeminiEndpoint(
    model,
    apiKey
  );

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const data = await callGemini(
        endpoint,
        prompt,
        timeoutMs
      );

      const rawText = extractGeminiText(data);

      const parsed = parseGeminiJson(rawText);

      return validateDirectiveResponse(
        parsed,
        cleanedNotes.length
      );
    } catch (error: unknown) {
      lastError = error;

      if (!(error instanceof LlmProviderError)) {
        throw error;
      }

      // Do not retry client/auth/validation errors.
      if (
        error.statusCode !== 429 &&
        error.statusCode !== 502 &&
        error.statusCode !== 504
      ) {
        throw error;
      }

      // No more retries.
      if (attempt >= MAX_RETRIES) {
        throw error;
      }

      // Exponential backoff:
      // 500ms → 1000ms
      const delay = 500 * Math.pow(2, attempt);

      await sleep(delay);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new LlmProviderError(
      "Gemini request failed.",
      502
    );
}