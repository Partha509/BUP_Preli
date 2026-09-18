import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-md w-full p-8 rounded-2xl border border-border bg-card shadow-xl space-y-6 text-center">
        <div className="p-4 rounded-full bg-primary/10 text-primary w-fit mx-auto border border-primary/20">
          <Zap className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold font-mono tracking-tight text-foreground">
            404
          </h1>
          <h2 className="text-base font-semibold">Substation Route Not Found</h2>
          <p className="text-xs text-muted-foreground">
            The requested telemetry endpoint or path does not exist on the GridWise campus network.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/dashboard">
            <Button className="w-full font-mono text-xs gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Operations Console</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
