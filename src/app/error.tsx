"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log safe error telemetry without leaking sensitive credentials
    console.error("GridWise Runtime Error:", error.message);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-md w-full p-6 md:p-8 rounded-2xl border border-destructive/40 bg-card/80 backdrop-blur-md shadow-2xl space-y-6 text-center">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive w-fit mx-auto border border-destructive/20">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">
            Unexpected System Exception
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The GridWise operations console encountered an unhandled client exception. State has been isolated safely without compromising backend integrity.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-secondary/50 border border-border text-left font-mono text-[11px] text-muted-foreground overflow-x-auto max-h-24">
          <code>{error.message || "An unknown client runtime error occurred."}</code>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="font-mono text-xs gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Console</span>
          </Button>

          <Link href="/dashboard">
            <Button
              variant="outline"
              className="font-mono text-xs gap-2"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Standard Scenario</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
