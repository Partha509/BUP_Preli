"use client";

import React from "react";
import { useScenario } from "@/context/ScenarioContext";
import { AlertTriangle, Clock, RefreshCw, XCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiErrorAlertProps {
  className?: string;
}

export function ApiErrorAlert({ className = "" }: ApiErrorAlertProps) {
  const { error, executeOptimization, isLoading } = useScenario();

  if (!error) return null;

  const isTimeout =
    error.toLowerCase().includes("timed out") ||
    error.toLowerCase().includes("timeout") ||
    error.includes("408");

  const isMalformed =
    error.toLowerCase().includes("malformed") ||
    error.toLowerCase().includes("400") ||
    error.toLowerCase().includes("422");

  const isServer =
    error.toLowerCase().includes("500") ||
    error.toLowerCase().includes("server error") ||
    error.toLowerCase().includes("unreachable");

  return (
    <div
      role="alert"
      className={`rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-xs font-mono space-y-3 transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {isTimeout ? (
            <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          ) : isMalformed ? (
            <ShieldAlert className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          )}

          <div className="space-y-1">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <span>
                {isTimeout
                  ? "Evaluation Timeout Exceeded (>30s)"
                  : isMalformed
                  ? "Schema Validation Rejection"
                  : isServer
                  ? "Backend Service Unavailable / Server Error"
                  : "Optimization Request Error"}
              </span>
            </h4>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {error}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => executeOptimization()}
          className="shrink-0 font-mono text-xs border-destructive/40 hover:bg-destructive/20 text-destructive hover:text-foreground"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Retry Optimization</span>
        </Button>
      </div>

      {isTimeout && (
        <div className="p-2.5 rounded-md bg-secondary/50 text-[11px] text-muted-foreground">
          <strong>Operator Notice:</strong> The BUP Hackathon evaluation policy enforces a strict 30-second execution budget per scenario. Verify your LLM inference and solver runtime bounds.
        </div>
      )}
    </div>
  );
}
