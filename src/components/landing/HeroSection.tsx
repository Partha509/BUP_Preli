import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Sparkles, Sliders, BatteryCharging, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#2D3A32] bg-[#0E1311] text-[#F3F5F4] p-6 sm:p-8 md:p-12 shadow-[0_8px_36px_rgba(0,0,0,0.35)] transition-colors">
      {/* Restrained Ambient Sage/Gold Glow */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-[#E5B25D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-[#2D3A32]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Hackathon Badge - Pill style matching navbar active pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#3A4B40] bg-[#1B241F] text-[#E5B25D] text-[11px] font-normal tracking-[0.12em] uppercase shadow-xs">
          <Sparkles className="w-3 h-3 text-[#E5B25D]" />
          <span>BUP CSE Fest 2026 Hackathon &bull; Online Preliminary</span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#F3F5F4] leading-[1.15]">
            <span>Grid</span>
            <span className="font-light text-[#E5B25D] ml-0.5">Wise</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl font-normal text-[#D6DDD8] mt-1">
              Smart Campus Microgrid Dispatch Engine
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-normal tracking-[0.12em] uppercase text-[#E5B25D]">
            Deterministic Two-Phase Simplex LP &bull; Guarded LLM Directive Interpretation
          </p>
        </div>

        {/* Problem Statement Summary */}
        <p className="text-xs sm:text-sm md:text-base text-[#9EA8A2] leading-relaxed">
          BUP operates a microgrid combining dynamic grid imports, rooftop solar PV, and battery energy storage (BESS). GridWise converts natural language operator directives into mathematically verified linear constraints and computes an exact cost-optimal 24-hour dispatch schedule with guaranteed battery neutrality ($E_{`23`} = E_0$).
        </p>

        {/* Quick Specs Chips - Muted sage borders with technical uppercase typography */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#2D3A32] bg-[#151D19] text-[11px] tracking-wider uppercase text-[#A6B2AB]">
            <Sliders className="w-3 h-3 text-[#E5B25D]" />
            24 Hourly Intervals
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#2D3A32] bg-[#151D19] text-[11px] tracking-wider uppercase text-[#A6B2AB]">
            <Sun className="w-3 h-3 text-[#E5B25D]" />
            Solar Curtailment Aware
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#2D3A32] bg-[#151D19] text-[11px] tracking-wider uppercase text-[#A6B2AB]">
            <BatteryCharging className="w-3 h-3 text-teal-400" />
            End-of-Day Neutrality
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#2D3A32] bg-[#151D19] text-[11px] tracking-wider uppercase text-[#A6B2AB]">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Deterministic Guardrails
          </span>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center gap-3.5 pt-2">
          <Link href="/dashboard">
            <Button
              variant="gold"
              size="lg"
              className="gap-2 px-5 text-xs font-semibold tracking-wider uppercase shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Launch Control Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>

          <Link href="/design-system">
            <Button
              variant="outline"
              size="lg"
              className="border-[#2D3A32] bg-[#141A17] hover:bg-[#1E2622] hover:border-[#3E4E43] text-[#F3F5F4] hover:text-[#E5B25D] text-xs font-normal tracking-wider uppercase px-5"
            >
              Design System Specs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
