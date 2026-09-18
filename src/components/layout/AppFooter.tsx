import React from "react";
import Link from "next/link";
import { ShieldCheck, Cpu, Mail, MapPin } from "lucide-react";

export function AppFooter() {
  return (
    <footer id="contact" className="border-t border-[#2D3A32] bg-[#0E1311] text-[#E0E6E2] mt-auto scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          {/* Col 1: Platform Info */}
          <div className="space-y-3">
            <div className="flex items-center tracking-tight select-none">
              <span className="font-semibold text-[15px] text-[#F3F5F4] tracking-tight">Grid</span>
              <span className="font-light text-[15px] text-[#E5B25D] tracking-tight ml-0.5">Wise</span>
              <span className="ml-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border border-[#3A4B40] bg-[#1B241F] text-[#E5B25D]">
                Control Room
              </span>
            </div>
            <p className="text-[#9EA8A2] leading-relaxed">
              LLM-assisted campus energy scheduling and cost optimization engine engineered for
              the BUP CSE Fest 2026 Hackathon.
            </p>
            <div className="flex items-center gap-2 text-[#9EA8A2] font-mono text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-[#E5B25D]" />
              <span>Planning Horizon: 24 Hourly Intervals</span>
            </div>
          </div>

          {/* Col 2: Challenge Specification */}
          <div className="space-y-2.5">
            <div className="font-medium text-[#E5B25D] uppercase tracking-[0.12em] text-[11px]">
              Canonical API Contract
            </div>
            <ul className="space-y-1.5 font-mono text-[11px] text-[#9EA8A2]">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">GET</span>
                <span>/health (Readiness)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#E5B25D] font-bold">POST</span>
                <span>/optimize-energy (Solver)</span>
              </li>
              <li className="text-muted-foreground/80">Payload: 24h Telemetry + Notes</li>
              <li className="text-muted-foreground/80">Deterministic Two-Phase Simplex</li>
            </ul>
          </div>

          {/* Col 3: Directives Supported */}
          <div className="space-y-2.5">
            <div className="font-medium text-[#E5B25D] uppercase tracking-[0.12em] text-[11px]">
              Supported Directives
            </div>
            <ul className="space-y-1 font-mono text-[11px] text-[#9EA8A2]">
              <li className="text-[#E5B25D]">&bull; solar_reduction</li>
              <li className="text-teal-400">&bull; minimum_battery_reserve</li>
              <li className="text-purple-400">&bull; no_charge_window</li>
              <li className="text-rose-400">&bull; no_discharge_window</li>
              <li className="text-slate-300">&bull; max_grid_window</li>
              <li className="text-muted-foreground">&bull; no_op (safe distractor)</li>
            </ul>
          </div>

          {/* Col 4: Contact & Resources */}
          <div className="space-y-2.5">
            <div className="font-medium text-[#E5B25D] uppercase tracking-[0.12em] text-[11px]">
              Contact & Inquiries
            </div>
            <ul className="space-y-1.5 text-[11px] text-[#9EA8A2]">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E5B25D]" />
                <a href="mailto:fest@bupcopc.tech" className="hover:text-[#F3F5F4] transition-colors">
                  fest@bupcopc.tech
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E5B25D]" />
                <span>Mirpur Cantonment, Dhaka-1216</span>
              </li>
              <li className="pt-1">
                <a
                  href="https://fest.bupcopc.tech"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#E5B25D] hover:underline"
                >
                  BUP CSE Fest 2026 Portal &nearr;
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2D3A32]/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#9EA8A2]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deterministic Guardrails &bull; Battery Conservation Protected ($E_{`23`} = E_0$)</span>
          </div>
          <div className="font-mono text-[11px]">
            Bangladesh University of Professionals &bull; CSE Fest 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
