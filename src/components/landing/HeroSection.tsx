import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Sparkles, Sliders, BatteryCharging, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-12 shadow-sm">
      {/* Background Accent Grid / Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-energy-battery/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BUP CSE Fest 2026 Hackathon &bull; Online Preliminary</span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            GridWise &mdash; Smart Campus Energy Optimization
          </h1>
          <p className="text-lg md:text-xl font-medium text-primary">
            LLM-Assisted Operator Directive Interpretation &bull; Mathematical Cost Minimization
          </p>
        </div>

        {/* Problem Statement Summary */}
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          BUP operates a smart campus using grid electricity, rooftop solar PV, and battery energy storage (BESS). Campus demand, solar availability, and grid tariffs vary throughout the day. GridWise processes natural-language operator directives through an LLM, validates them deterministically with strict guardrails, and solves the 24-hour dispatch schedule to minimize electricity costs in Bangladeshi Taka (BDT).
        </p>

        {/* Quick Specs Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-secondary/60 text-xs font-mono text-muted-foreground">
            <Sliders className="w-3.5 h-3.5 text-primary" />
            24 Hourly Intervals
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-secondary/60 text-xs font-mono text-muted-foreground">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            Solar Curtailment Aware
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-secondary/60 text-xs font-mono text-muted-foreground">
            <BatteryCharging className="w-3.5 h-3.5 text-sky-400" />
            End-of-Day Battery Neutrality
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-secondary/60 text-xs font-mono text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Deterministic Guardrails
          </span>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="font-semibold gap-2 shadow-md">
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Optimization Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link href="/design-system">
            <Button variant="outline" size="lg">
              View Design System
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
