"use client";

import React, { useState, useEffect } from "react";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { useScenario } from "@/context/ScenarioContext";
import { EnergyAssistantDrawer, AssistantTriggerButton } from "@/components/ai";

interface AppShellProps {
  children: React.ReactNode;
  containerClassName?: string;
  onRunOptimization?: () => void;
  onToggleAiAssistant?: () => void;
}

export function AppShell({
  children,
  containerClassName = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
  onRunOptimization,
  onToggleAiAssistant,
}: AppShellProps) {
  const { executeOptimization } = useScenario();
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    const handleToggleAi = () => {
      setIsAiOpen((prev) => !prev);
    };
    window.addEventListener("gridwise-toggle-ai", handleToggleAi);
    return () => window.removeEventListener("gridwise-toggle-ai", handleToggleAi);
  }, []);

  const handleOptimize = () => {
    if (onRunOptimization) {
      onRunOptimization();
    } else {
      executeOptimization();
    }
  };

  const handleToggleAi = () => {
    if (onToggleAiAssistant) {
      onToggleAiAssistant();
    } else {
      setIsAiOpen((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary relative">
      <AppHeader
        onRunOptimization={handleOptimize}
        onToggleAiAssistant={handleToggleAi}
      />
      <main className={`flex-1 ${containerClassName}`}>{children}</main>
      <AppFooter />

      {/* Floating AI Copilot Trigger Button */}
      <AssistantTriggerButton
        isOpen={isAiOpen}
        onClick={() => setIsAiOpen(true)}
      />

      {/* Explanatory Energy AI Assistant Drawer */}
      <EnergyAssistantDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />
    </div>
  );
}
