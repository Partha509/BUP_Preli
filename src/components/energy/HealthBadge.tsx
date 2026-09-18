"use client";

import React, { useEffect, useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

type HealthStatus = "online" | "degraded" | "offline";

interface HealthState {
  status: HealthStatus;
  latencyMs: number | null;
  lastChecked: Date | null;
}

export function HealthBadge({ className = "" }: { className?: string }) {
  const [health, setHealth] = useState<HealthState>({
    status: "online",
    latencyMs: 12,
    lastChecked: null,
  });

  const checkHealth = async () => {
    const start = performance.now();
    try {
      // Check relative /health endpoint or NEXT_PUBLIC_API_URL
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const endpoint = `${baseUrl}/health`;
      
      const res = await fetch(endpoint, {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      const latency = Math.round(performance.now() - start);

      if (res.ok) {
        setHealth({
          status: latency > 5000 ? "degraded" : "online",
          latencyMs: latency,
          lastChecked: new Date(),
        });
      } else {
        setHealth({
          status: "offline",
          latencyMs: latency,
          lastChecked: new Date(),
        });
      }
    } catch {
      // If external call fails, check internal /health fallback
      try {
        const localRes = await fetch("/health", { cache: "no-store" });
        const latency = Math.round(performance.now() - start);
        if (localRes.ok) {
          setHealth({
            status: "online",
            latencyMs: latency,
            lastChecked: new Date(),
          });
          return;
        }
      } catch {}

      setHealth({
        status: "offline",
        latencyMs: null,
        lastChecked: new Date(),
      });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (health.status) {
      case "online":
        return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]";
      case "degraded":
        return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]";
      case "offline":
        return "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]";
    }
  };

  const getStatusText = () => {
    switch (health.status) {
      case "online":
        return "System Online";
      case "degraded":
        return "High Latency";
      case "offline":
        return "API Offline";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-card/80 text-xs font-mono select-none cursor-help transition-colors hover:bg-secondary/60 ${className}`}
            role="status"
            aria-live="polite"
          >
            <span className="relative flex h-2 w-2">
              {health.status === "online" && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${getStatusColor()}`} />
            </span>
            <span className="font-medium text-foreground text-[11px] sm:text-xs">
              {getStatusText()}
            </span>
            {health.latencyMs !== null && (
              <span className="text-[10px] text-muted-foreground border-l border-border pl-1.5 hidden md:inline">
                {health.latencyMs}ms
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <div className="space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <span>Endpoint: GET /health</span>
            </div>
            <div>Status: <span className="font-bold">{health.status.toUpperCase()}</span></div>
            <div>Latency: {health.latencyMs ? `${health.latencyMs} ms` : "N/A"}</div>
            <div>
              Last check:{" "}
              {health.lastChecked
                ? health.lastChecked.toLocaleTimeString()
                : "Checking..."}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
