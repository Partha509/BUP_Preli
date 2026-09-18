import { OptimizeEnergyRequest, OptimizeEnergyResponse } from "@/lib/types/gridwise";

export class ApiError extends Error {
  public statusCode?: number;
  public details?: unknown;

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export interface HealthCheckResult {
  status: "ok" | "degraded" | "offline";
  latencyMs: number;
  error?: string;
}

export class GridWiseApiClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(baseUrl?: string, timeoutMs: number = 30000) {
    // In browser, fallback to localhost:8000 or relative /api if needed
    this.baseUrl = (
      baseUrl ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8000"
    ).replace(/\/$/, "");
    this.timeoutMs = timeoutMs;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * GET /health - Checks live backend availability and calculates round-trip latency
   */
  public async checkHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      // First try live backend, fallback to local Next.js /health if baseUrl fails
      let response: Response;
      try {
        response = await fetch(`${this.baseUrl}/health`, {
          method: "GET",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
      } catch (directErr) {
        // Fallback to internal health endpoint on the current domain
        response = await fetch("/health", {
          method: "GET",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
      }

      clearTimeout(timeoutId);
      const latencyMs = Math.round(performance.now() - startTime);

      if (!response.ok) {
        return {
          status: "degraded",
          latencyMs,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      if (data && (data.status === "ok" || data.status === "healthy")) {
        return { status: "ok", latencyMs };
      }

      return { status: "degraded", latencyMs, error: "Unexpected health payload" };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const latencyMs = Math.round(performance.now() - startTime);
      const isTimeout = err instanceof Error && err.name === "AbortError";
      return {
        status: "offline",
        latencyMs,
        error: isTimeout ? "Health check timed out (>8s)" : "Service unreachable",
      };
    }
  }

  /**
   * POST /optimize-energy - Dispatches single scenario payload to backend solver
   * Enforces 30-second timeout and validates output contract.
   */
  public async optimizeEnergy(
    payload: OptimizeEnergyRequest
  ): Promise<OptimizeEnergyResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/optimize-energy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: any = null;
        try {
          errorData = await response.json();
        } catch {
          // Non-JSON response body
        }

        const message =
          errorData?.detail ||
          errorData?.message ||
          `Optimization failed with status code ${response.status} (${response.statusText})`;

        if (response.status === 400) {
          throw new ApiError(
            `Malformed Request: ${message}`,
            400,
            errorData
          );
        } else if (response.status === 422) {
          throw new ApiError(
            `Semantic Validation Error: ${message}`,
            422,
            errorData
          );
        } else if (response.status >= 500) {
          throw new ApiError(
            `Backend Server Error: The optimization solver encountered an internal error. Please check server logs.`,
            response.status,
            errorData
          );
        } else {
          throw new ApiError(message, response.status, errorData);
        }
      }

      const data = (await response.json()) as OptimizeEnergyResponse;

      // Validate required response fields
      if (
        !data ||
        typeof data.scenario_id !== "string" ||
        !Array.isArray(data.directive_interpretation) ||
        !Array.isArray(data.hourly_plan) ||
        typeof data.total_grid_kwh !== "number" ||
        typeof data.total_cost_bdt !== "number" ||
        typeof data.peak_grid_kwh !== "number" ||
        typeof data.plan_summary !== "string"
      ) {
        throw new ApiError(
          "Backend response did not strictly adhere to the GridWise canonical output schema.",
          502,
          data
        );
      }

      return data;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof ApiError) {
        throw err;
      }

      if (err instanceof Error && err.name === "AbortError") {
        throw new ApiError(
          `Request Timed Out: Backend exceeded the maximum allowed evaluation limit of ${this.timeoutMs / 1000} seconds.`,
          408
        );
      }

      const msg = err instanceof Error ? err.message : "Network error occurred";
      throw new ApiError(
        `Failed to communicate with optimization service at ${this.baseUrl}. Please ensure the backend is running. (${msg})`,
        503
      );
    }
  }
}

export const apiClient = new GridWiseApiClient();
