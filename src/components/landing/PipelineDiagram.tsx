import React from "react";
import {
  FileText,
  Cpu,
  ShieldCheck,
  Calculator,
  CalendarCheck,
  ArrowRight,
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
      badgeColor: "text-muted-foreground border-border bg-secondary/40",
      accent: "border-border hover:border-primary/40",
    },
    {
      step: "02",
      title: "LLM Interpreter",
      subtitle: "Language Extraction",
      desc: "Generative language model translates human text into structured candidate directives and parameters.",
      icon: Cpu,
      badge: "LLM Path",
      badgeColor: "text-amber-500 border-amber-500/30 bg-amber-500/10",
      accent: "border-amber-500/30 hover:border-amber-500/60",
    },
    {
      step: "03",
      title: "Deterministic Guardrails",
      subtitle: "Safety & Bounds",
      desc: "Deterministic checks: valid type whitelist, unique sorted hours [0..23], parameter bounds, and no_op semantics.",
      icon: ShieldCheck,
      badge: "Zero Hallucination",
      badgeColor: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
      accent: "border-emerald-500/30 hover:border-emerald-500/60",
    },
    {
      step: "04",
      title: "Math Optimizer",
      subtitle: "Cost Minimization",
      desc: "Solves hourly energy balance: minimizes total BDT electricity cost under battery bounds and applied directives.",
      icon: Calculator,
      badge: "Deterministic Math",
      badgeColor: "text-sky-400 border-sky-400/30 bg-sky-400/10",
      accent: "border-sky-400/30 hover:border-sky-400/60",
    },
    {
      step: "05",
      title: "24-Hour Schedule",
      subtitle: "Final API Response",
      desc: "Returns exact machine-checkable response: directive interpretations, 24 hourly dispatch actions, and plan summary.",
      icon: CalendarCheck,
      badge: "Canonical JSON",
      badgeColor: "text-primary border-primary/30 bg-primary/10",
      accent: "border-primary/40 hover:border-primary",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Section 03 Specification</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          End-to-End Processing Flow
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Human notes are never directly trusted as math. They are interpreted into structured data, validated by deterministic guardrails, and only then applied to the mathematical optimization solver.
        </p>
      </div>

      {/* Grid of 5 Pipeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className={`relative rounded-xl border bg-card p-5 space-y-3 transition-all duration-200 flex flex-col justify-between ${item.accent}`}
            >
              {/* Header inside card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-muted-foreground/80">
                    STAGE {item.step}
                  </span>
                  <div className="p-2 rounded-lg bg-secondary/80 border border-border/40">
                    <Icon className="w-4 h-4 text-foreground" />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </p>

              {/* Bottom Tag */}
              <div className="pt-2 border-t border-border/40">
                <span
                  className={`inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${item.badgeColor}`}
                >
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
