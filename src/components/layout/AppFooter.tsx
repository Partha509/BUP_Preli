import React from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Terminal, Cpu } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          {/* Col 1: Platform Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                <Zap className="w-4 h-4" />
              </div>
              <span>GridWise Smart Campus</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              LLM-assisted campus energy scheduling and cost optimization engine engineered for
              BUP CSE Fest 2026 Hackathon.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span>Planning Horizon: 24 Hourly Intervals</span>
            </div>
          </div>

          {/* Col 2: Challenge Specification */}
          <div className="space-y-2">
            <div className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              Canonical Contract
            </div>
            <ul className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">GET</span>
                <span>/health (Readiness)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-primary font-bold">POST</span>
                <span>/optimize-energy (Main)</span>
              </li>
              <li className="text-muted-foreground/80">Response: Structured JSON</li>
              <li className="text-muted-foreground/80">1–3 Operator Notes / Scenario</li>
            </ul>
          </div>

          {/* Col 3: Directives Supported */}
          <div className="space-y-2">
            <div className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              Supported Directives
            </div>
            <ul className="space-y-1 font-mono text-[11px] text-muted-foreground">
              <li className="text-amber-500">&bull; solar_reduction</li>
              <li className="text-sky-400">&bull; minimum_battery_reserve</li>
              <li className="text-purple-400">&bull; no_charge_window</li>
              <li className="text-rose-400">&bull; no_discharge_window</li>
              <li className="text-indigo-400">&bull; max_grid_window</li>
              <li className="text-slate-400">&bull; no_op (safe distractor)</li>
            </ul>
          </div>

          {/* Col 4: Platform Navigation */}
          <div className="space-y-2">
            <div className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              Resources
            </div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Operations Dashboard
                </Link>
              </li>
              <li>
                <Link href="/design-system" className="hover:text-primary transition-colors">
                  Design System Kitchen Sink
                </Link>
              </li>
              <li>
                <a
                  href="https://fest.bupcopc.tech"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  BUP CSE Fest 2026 Portal &nearr;
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Deterministic Guardrails &bull; Battery Neutrality Protected ($E_{`23`} = E_0$)</span>
          </div>
          <div className="font-mono text-[11px]">
            Bangladesh University of Professionals &bull; Mirpur Cantonment
          </div>
        </div>
      </div>
    </footer>
  );
}
