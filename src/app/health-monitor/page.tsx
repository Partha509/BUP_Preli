"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Radio,
  Server,
  Terminal,
  ShieldCheck,
} from "lucide-react";

type HealthState = "loading" | "healthy" | "unhealthy" | "error";

interface HealthData {
  status: HealthState;
  httpStatus: number | null;
  responseTimeMs: number | null;
  endpoint: string;
  lastChecked: Date | null;
  rawPayload: unknown;
  errorMessage: string | null;
}

export default function HealthMonitorPage() {
  const [health, setHealth] = useState<HealthData>({
    status: "loading",
    httpStatus: null,
    responseTimeMs: null,
    endpoint: "/health",
    lastChecked: null,
    rawPayload: null,
    errorMessage: null,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsRefreshing(true);
    const start = performance.now();

    try {
      const res = await fetch("/health", {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const latency = Math.round(performance.now() - start);

      let payload: unknown = null;
      try {
        payload = await res.json();
      } catch {
        // Non-JSON response
      }

      if (res.ok) {
        setHealth({
          status: "healthy",
          httpStatus: res.status,
          responseTimeMs: latency,
          endpoint: "/health",
          lastChecked: new Date(),
          rawPayload: payload,
          errorMessage: null,
        });
      } else {
        setHealth({
          status: "unhealthy",
          httpStatus: res.status,
          responseTimeMs: latency,
          endpoint: "/health",
          lastChecked: new Date(),
          rawPayload: payload,
          errorMessage: `HTTP ${res.status}: ${res.statusText || "Service returned non-200 status code"}`,
        });
      }
    } catch (err: unknown) {
      const latency = Math.round(performance.now() - start);
      const msg = err instanceof Error ? err.message : "Network failure or endpoint unreachable";

      setHealth({
        status: "error",
        httpStatus: null,
        responseTimeMs: latency,
        endpoint: "/health",
        lastChecked: new Date(),
        rawPayload: null,
        errorMessage: msg,
      });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const getStatusBadge = () => {
    switch (health.status) {
      case "loading":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Checking API health...
          </span>
        );
      case "healthy":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            API Healthy
          </span>
        );
      case "unhealthy":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            API Degraded
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-mono">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            API Unavailable
          </span>
        );
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto py-2">
        {/* Header navigation & title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D3A32] pb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-full border border-[#2D3A32] bg-[#141A17] hover:bg-[#1B241F] hover:border-[#415347] text-[#9EA8A2] hover:text-[#F3F5F4] transition-colors"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  <span className="text-[#F3F5F4]">GridWise</span>{" "}
                  <span className="text-[#E5B25D] font-light">API Health Monitor</span>
                </h1>
              </div>
              <p className="text-xs text-[#9EA8A2] font-mono mt-0.5">
                Real-Time Backend Service Probes &bull; Canonical GET /health Readiness
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <Button
              variant="outline"
              size="sm"
              onClick={checkHealth}
              disabled={isRefreshing}
              className="h-8 px-3 text-xs font-mono border-[#2D3A32] bg-[#141A17] hover:bg-[#1B241F] text-[#F3F5F4]"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Status Error Alert if unavailable */}
        {health.status === "error" && (
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>API Unavailable — Unable to reach the health endpoint.</span>
            </div>
            <p className="text-rose-300/80 pl-6">
              Error details: {health.errorMessage || "The backend service failed to respond to the readiness probe."}
            </p>
            <div className="pl-6 text-[11px] text-rose-400/60">
              Ensure the Next.js development server is running and accessible on the local port.
            </div>
          </div>
        )}

        {/* 4 Telemetry Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Status Card */}
          <Card className="border-[#2D3A32] bg-[#0E1311]">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-[11px] font-mono uppercase tracking-wider text-[#9EA8A2] flex items-center justify-between">
                <span>System Status</span>
                <Radio className="w-3.5 h-3.5 text-[#E5B25D]" />
              </CardDescription>
              <CardTitle className="text-lg font-bold font-mono text-[#F3F5F4] pt-1">
                {health.status === "loading"
                  ? "Checking..."
                  : health.status === "healthy"
                  ? "API Healthy"
                  : health.status === "unhealthy"
                  ? "Unhealthy"
                  : "Unavailable"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-[11px] font-mono text-[#9EA8A2]">
              {health.status === "healthy"
                ? "All systems operational"
                : health.status === "loading"
                ? "Connecting to server..."
                : "Service probe failed"}
            </CardContent>
          </Card>

          {/* 2. HTTP Status Card */}
          <Card className="border-[#2D3A32] bg-[#0E1311]">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-[11px] font-mono uppercase tracking-wider text-[#9EA8A2] flex items-center justify-between">
                <span>HTTP Code</span>
                <Server className="w-3.5 h-3.5 text-[#E5B25D]" />
              </CardDescription>
              <CardTitle className="text-lg font-bold font-mono text-[#F3F5F4] pt-1">
                {health.httpStatus ? `HTTP ${health.httpStatus}` : health.status === "loading" ? "..." : "No Response"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-[11px] font-mono text-[#9EA8A2]">
              {health.httpStatus === 200
                ? "200 OK — Ready"
                : health.httpStatus
                ? `HTTP status ${health.httpStatus}`
                : "Connection refused or timed out"}
            </CardContent>
          </Card>

          {/* 3. Latency Card */}
          <Card className="border-[#2D3A32] bg-[#0E1311]">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-[11px] font-mono uppercase tracking-wider text-[#9EA8A2] flex items-center justify-between">
                <span>Response Time</span>
                <Activity className="w-3.5 h-3.5 text-[#E5B25D]" />
              </CardDescription>
              <CardTitle className="text-lg font-bold font-mono text-[#F3F5F4] pt-1">
                {health.responseTimeMs != null ? `${health.responseTimeMs} ms` : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-[11px] font-mono text-[#9EA8A2]">
              {health.responseTimeMs != null
                ? health.responseTimeMs < 100
                  ? "Sub-100ms ultra-low latency"
                  : "Normal response window"
                : "Awaiting measurement"}
            </CardContent>
          </Card>

          {/* 4. Target Endpoint Card */}
          <Card className="border-[#2D3A32] bg-[#0E1311]">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-[11px] font-mono uppercase tracking-wider text-[#9EA8A2] flex items-center justify-between">
                <span>Probe Target</span>
                <Terminal className="w-3.5 h-3.5 text-[#E5B25D]" />
              </CardDescription>
              <CardTitle className="text-lg font-bold font-mono text-[#F3F5F4] pt-1">
                {health.endpoint}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-[11px] font-mono text-[#9EA8A2]">
              Section 06.2 Official Probe
            </CardContent>
          </Card>
        </div>

        {/* Live Payload & Verification Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Raw JSON Payload */}
          <Card className="border-[#2D3A32] bg-[#0E1311]">
            <CardHeader className="p-4 border-b border-[#2D3A32]/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-mono font-bold text-[#F3F5F4] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#E5B25D]" />
                  <span>Live Endpoint Response</span>
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-[#2D3A32] text-[#9EA8A2]">
                  JSON
                </Badge>
              </div>
              <CardDescription className="text-xs text-[#9EA8A2] font-mono">
                Exact response returned by GET {health.endpoint}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <pre className="p-3.5 rounded-lg bg-[#070A09] border border-[#2D3A32] text-xs font-mono text-[#34D399] overflow-x-auto min-h-[120px] flex items-center">
                {health.status === "loading" ? (
                  <span className="text-[#9EA8A2] animate-pulse">Checking API health...</span>
                ) : health.rawPayload ? (
                  JSON.stringify(health.rawPayload, null, 2)
                ) : (
                  <span className="text-rose-400">
                    {health.errorMessage || "No response received from endpoint."}
                  </span>
                )}
              </pre>
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#9EA8A2]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#E5B25D]" />
                  <span>
                    Last checked:{" "}
                    {health.lastChecked ? health.lastChecked.toLocaleTimeString() : "Never"}
                  </span>
                </span>
                <span className="text-[10px] text-[#9EA8A2]/60">Auto-polls every 15s</span>
              </div>
            </CardContent>
          </Card>

          {/* Canonical Challenge Specifications Card */}
          <Card className="border-[#2D3A32] bg-[#0E1311]">
            <CardHeader className="p-4 border-b border-[#2D3A32]/60">
              <CardTitle className="text-sm font-mono font-bold text-[#F3F5F4] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E5B25D]" />
                <span>Active Competition Endpoints</span>
              </CardTitle>
              <CardDescription className="text-xs text-[#9EA8A2] font-mono">
                Official BUP CSE Fest 2026 API contract verification
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-[#141A17] border border-[#2D3A32] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#F3F5F4]">GET /health</div>
                  <div className="text-[11px] text-[#9EA8A2]">Readiness probe returning status: ok</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  READY
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#141A17] border border-[#2D3A32] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#F3F5F4]">POST /optimize-energy</div>
                  <div className="text-[11px] text-[#9EA8A2]">24-hour LP dispatch & LLM directive parsing</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#E5B25D]/10 text-[#E5B25D] border border-[#E5B25D]/30">
                  OPTIMIZER
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#141A17] border border-[#2D3A32] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#F3F5F4]">POST /api/chat</div>
                  <div className="text-[11px] text-[#9EA8A2]">Grounded Explanatory Copilot assistant</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  GEMINI
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
