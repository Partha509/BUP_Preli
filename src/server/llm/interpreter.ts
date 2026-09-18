import { BatteryParams, DirectiveInterpretation } from "@/lib/types/gridwise";
import { buildDirectiveInterpretationPrompt } from "./prompt";

export class LlmProviderError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode: number = 502, details?: unknown) {
    super(message);
    this.name = "LlmProviderError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export interface RawDirectiveInterpretation {
  note_index: number;
  applies?: boolean;
  directive_type: string;
  structured_adjustment: Record<string, unknown> | null;
  explanation: string;
}

/**
 * Calls the configured Gemini model to interpret operator notes.
 * Enforces strict provider failure error handling without fabricating fake no_op interpretations.
 */
export async function interpretOperatorNotesWithLlm(
  operatorNotes: string[],
  battery: BatteryParams,
  timeoutMs: number = 25000
): Promise<RawDirectiveInterpretation[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    throw new LlmProviderError(
      "GEMINI_API_KEY is not configured on the server. The LLM operator-note interpretation service cannot proceed without valid credentials.",
      503
    );
  }

  let model = (process.env.GEMINI_MODEL || "gemini-flash-lite-latest").trim();
  if (model === "gemini-2.5-flash" || model === "gemini-2.5-flash-lite") {
    // Google Generative Language API retired gemini-2.5-flash; auto-upgrade to current flash-lite
    model = "gemini-flash-lite-latest";
  }
  const prompt = buildDirectiveInterpretationPrompt(operatorNotes, battery);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

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
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      let errorBody: any = null;
      try {
        errorBody = await response.json();
      } catch {}

      const errorMsg =
        errorBody?.error?.message ||
        `Gemini API returned status ${response.status} (${response.statusText})`;

      if (response.status === 429) {
        throw new LlmProviderError(
          `Gemini rate limit exceeded: ${errorMsg}`,
          429,
          errorBody
        );
      } else if (response.status === 401 || response.status === 403) {
        throw new LlmProviderError(
          `Gemini authentication failed: Invalid or unauthorized API key.`,
          503,
          errorBody
        );
      } else {
        throw new LlmProviderError(
          `LLM generation failed: ${errorMsg}`,
          502,
          errorBody
        );
      }
    }

    const data = await response.json();
    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText || typeof rawText !== "string") {
      throw new LlmProviderError(
        "Gemini returned an empty or invalid candidate response payload.",
        502,
        data
      );
    }

    let parsed: unknown;
    try {
      // Strip markdown code fences if model enclosed JSON in ```json ... ```
      const cleaned = rawText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr: any) {
      throw new LlmProviderError(
        `Failed to parse Gemini response as JSON: ${parseErr.message}`,
        502,
        { rawText }
      );
    }

    if (!Array.isArray(parsed)) {
      throw new LlmProviderError(
        "Gemini response did not return a JSON array of directive interpretations.",
        502,
        parsed
      );
    }

    return parsed as RawDirectiveInterpretation[];
  } catch (err: unknown) {
    clearTimeout(timer);

    if (err instanceof LlmProviderError) {
      throw err;
    }

    if (err instanceof Error && err.name === "AbortError") {
      throw new LlmProviderError(
        `Gemini API request timed out after ${timeoutMs / 1000} seconds.`,
        504
      );
    }

    const msg = err instanceof Error ? err.message : "Unknown network failure";
    throw new LlmProviderError(
      `Failed to communicate with LLM provider at ${endpoint.split("?")[0]}: ${msg}`,
      502
    );
  }
}
