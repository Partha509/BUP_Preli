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
        <Button variant="outline" size="sm" className={`gap-1.5 text-xs font-mono ${className}`}>
          <Code2 className="w-3.5 h-3.5 text-primary" />
          <span>View Request JSON</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono text-base">
            <Code2 className="w-4 h-4 text-primary" />
            <span>POST /optimize-energy Request Payload</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Exact machine-checkable JSON matching Problem Statement Section 07.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs text-foreground/90 my-2">
          <pre className="whitespace-pre">{jsonString}</pre>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between w-full pt-2">
          <span className="text-[11px] font-mono text-muted-foreground">
            {activeRequest.hours.length} Hours &bull; {activeRequest.operator_notes.length} Operator Notes
          </span>
          <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5 font-mono text-xs">
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy JSON</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
