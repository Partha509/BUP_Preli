"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code2, Copy, Check } from "lucide-react";
import { useScenario } from "@/context/ScenarioContext";

export function RawPayloadModal({ className = "" }: { className?: string }) {
  const { activeRequest } = useScenario();
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(activeRequest, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-1.5 text-[11px] font-mono tracking-wider uppercase rounded-full border border-border/80 bg-secondary/40 px-3 h-8 sm:h-9 ${className}`}
        >
          <Code2 className="w-3 h-3 text-[#E5B25D]" />
          <span>Request JSON</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-border bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-foreground">
            <Code2 className="w-4 h-4 text-[#E5B25D]" />
            <span>POST /optimize-energy Request Payload</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Exact machine-checkable JSON matching Problem Statement Section 07.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto rounded-xl border border-border/80 bg-secondary/30 p-4 font-mono text-xs text-foreground/90 my-2">
          <pre className="whitespace-pre">{jsonString}</pre>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between w-full pt-2">
          <span className="text-[11px] font-mono text-muted-foreground">
            {activeRequest.hours.length} Hours &bull; {activeRequest.operator_notes.length} Operator Notes
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="gap-1.5 font-mono text-[11px] uppercase tracking-wider rounded-full border-border px-3.5"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy JSON</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
