import React from "react";
import { AppShell } from "@/components/layout";
import { HeroSection, PipelineDiagram, ChallengeSpecsCard } from "@/components/landing";

export default function Home() {
  return (
    <AppShell>
      <div className="space-y-12 py-4">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. End-to-End Processing Flow (Section 03) */}
        <PipelineDiagram />

        {/* 3. Challenge Specification & Canonical Constraints */}
        <ChallengeSpecsCard />
      </div>
    </AppShell>
  );
}
