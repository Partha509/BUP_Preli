import React from "react";
import {
  FileText,
  Cpu,
  ShieldCheck,
  Calculator,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";

export function PipelineDiagram() {
  const steps = [
    {
      step: "01",
      title: "Input Data & Notes",
      subtitle: "Campus Telemetry",
      desc: "24h hourly forecast (demand, solar, ToU tariff, BESS) + 1–3 natural language operator notes.",
      icon: FileText,
      badge: "Input Payload",
    },
    {
      step: "02",
      title: "LLM Interpreter",
      subtitle: "Language Extraction",
      desc: "Generative model translates human operator notes into candidate structured directives.",
      icon: Cpu,
      badge: "LLM Path",
    },
    {
      step: "03",
      title: "Deterministic Guardrails",
      subtitle: "Safety & Validation",
      desc: "Strict type whitelist, sorted unique hours [0..23], parameter bounds, and safe no_op semantics.",
      icon: ShieldCheck,
      badge: "Guardrails",
    },
    {
      step: "04",
      title: "Math LP Optimizer",
      subtitle: "Cost Minimization",
      desc: "Two-Phase Simplex solves continuous LP: minimizes total BDT cost while enforcing battery conservation.",
      icon: Calculator,
      badge: "Deterministic LP",
    },
    {
      step: "05",
      title: "24h Plan & Verification",
      subtitle: "API Canonical Output",
      desc: "Returns exact contract response: directive evaluations, 24 hourly dispatch actions, and plan summary.",
      icon: CalendarCheck,
      badge: "Canonical JSON",
    },
  ];

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[#E5B25D] text-[11px] uppercase tracking-[0.14em] font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Section 03 Architecture</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          End-to-End Processing Architecture
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
          Human operator notes are never directly trusted as math. They are parsed into structured candidates, bounded by deterministic guardrails, and fed into the linear program solver.
        </p>
      </div>

      {/* Grid of 5 Pipeline Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 relative">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-3 transition-all flex flex-col justify-between hover:border-strong-border"
            >
              {/* Header inside card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-[#E5B25D] font-medium">
                    STAGE {item.step}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-secondary/80 border border-border/80 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-foreground/80" />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-xs text-foreground tracking-tight">{item.title}</h3>
                  <span className="text-[10px] tracking-wider uppercase text-muted-foreground font-mono">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                {item.desc}
              </p>

              {/* Bottom Tag - Navbar active pill miniature style */}
              <div className="pt-2 border-t border-border/40">
                <span className="inline-block text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-[#3A4B40] bg-[#1B241F] text-[#E5B25D]">
                  {item.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
