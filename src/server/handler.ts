import { NextRequest, NextResponse } from "next/server";
import { validateOptimizeEnergyRequest, ValidationError } from "./schemas/input";
import { validateOptimizeEnergyResponse } from "./schemas/output";
import { interpretOperatorNotesWithLlm, LlmProviderError } from "./llm/interpreter";
import { validateAndGuardrailDirectives, GuardrailError } from "./validator/directives";
import { optimizeEnergySchedule, OptimizationError } from "./optimizer/optimizer";
import { ReplayValidationError } from "./optimizer/replay";

/**
 * Unified request handler for POST /optimize-energy
 * Implements the competition pipeline:
 * Request Validation -> LLM Interpreter -> Deterministic Guardrails -> LP Optimizer -> Replay -> Output
 */
export async function handleOptimizeEnergyRequest(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. Safe JSON parsing
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Malformed JSON: Request body could not be parsed as valid JSON." },
        { status: 400 }
      );
    }

    // 2. Validate request schema
    const validatedRequest = validateOptimizeEnergyRequest(rawBody);

    // 3. LLM Operator-Note Interpretation
    // Will throw LlmProviderError (5xx) if Gemini API fails or is unconfigured.
    // Strictly does NOT invent fake no_op on provider failure.
    const rawDirectives = await interpretOperatorNotesWithLlm(
      validatedRequest.operator_notes,
      validatedRequest.battery,
      25000 // 25s internal timeout within 30s envelope
    );

    // 4. Deterministic Directive Guardrails
    const guardrailedDirectives = validateAndGuardrailDirectives(
      rawDirectives,
      validatedRequest.operator_notes.length,
      validatedRequest.battery
    );

    // 5. Deterministic Energy Optimization (Two-Phase Simplex LP) + Replay Validation
    const responseData = optimizeEnergySchedule(
      validatedRequest.scenario_id,
      validatedRequest.hours,
      validatedRequest.battery,
      guardrailedDirectives
    );

    // 6. Validate Output Contract
    const finalResponse = validateOptimizeEnergyResponse(responseData);

    return NextResponse.json(finalResponse, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: err.message },
        { status: 400 }
      );
    }

    if (err instanceof LlmProviderError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode || 502 }
      );
    }

    if (err instanceof GuardrailError || err instanceof OptimizationError || err instanceof ReplayValidationError) {
      return NextResponse.json(
        { error: err.message },
        { status: 422 }
      );
    }

    // Controlled 500 without leaking secrets, credentials, or internal stack traces
    const safeMsg = err instanceof Error ? err.message : "Internal optimization service error";
    console.error("Controlled Backend Error:", safeMsg);

    return NextResponse.json(
      {
        error: "Controlled Internal Server Error: The optimization service encountered an internal error. Please inspect server logs.",
      },
      { status: 500 }
    );
  }
}
