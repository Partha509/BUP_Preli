"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Presentation,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Layers,
  HelpCircle,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoStepCard, DEMO_STEPS } from "./DemoStepCard";
import { useScenario } from "@/context/ScenarioContext";
import { useRole } from "@/hooks/useRole";

export function DemoWalkthroughBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const { selectScenario, resetToDefault } = useScenario();
  const { setRole } = useRole();

  // Scroll and pulse highlight target DOM element
  const highlightStepTarget = useCallback((stepId: number) => {
    const step = DEMO_STEPS.find((s) => s.id === stepId);
    if (!step) return;

    // Optional role switching alignment for specific steps
    if (stepId === 7) {
      setRole("analyst");
    }

    setTimeout(() => {
      const el = document.getElementById(step.targetElementId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("demo-highlight-target");
        setTimeout(() => {
          el.classList.remove("demo-highlight-target");
        }, 2500);
      }
    }, 100);
  }, [setRole]);

  const handleNext = useCallback(() => {
    if (currentStep < DEMO_STEPS.length) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setIsComplete(false);
      highlightStepTarget(next);
    } else {
      setIsComplete(true);
    }
  }, [currentStep, highlightStepTarget]);

  const handlePrev = useCallback(() => {
    if (isComplete) {
      setIsComplete(false);
      return;
    }
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      highlightStepTarget(prev);
    }
  }, [currentStep, isComplete, highlightStepTarget]);

  const handleSelectStep = useCallback((stepId: number) => {
    setCurrentStep(stepId);
    setIsComplete(false);
    highlightStepTarget(stepId);
  }, [highlightStepTarget]);

  const handleReset = useCallback(() => {
    setCurrentStep(1);
    setIsComplete(false);
    selectScenario("GRID-101");
    setRole("operator");
    highlightStepTarget(1);
  }, [selectScenario, setRole, highlightStepTarget]);

  // Keyboard shortcut navigation (Ctrl+D, ArrowRight, ArrowLeft, 1..7)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Ctrl + D or Cmd + D: Toggle Walkthrough Bar visibility / minimize
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        if (!isVisible) {
          setIsVisible(true);
          setIsMinimized(false);
        } else {
          setIsMinimized((prev) => !prev);
        }
        return;
      }

      // ArrowRight: Next Step
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
        return;
      }

      // ArrowLeft: Prev Step
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
        return;
      }

      // Direct step jump with numeric keys 1..7
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= DEMO_STEPS.length && !e.ctrlKey && !e.metaKey && !e.altKey) {
        handleSelectStep(num);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, isMinimized, currentStep, isComplete, handleNext, handlePrev, handleSelectStep]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-20 z-50 animate-in fade-in slide-in-from-bottom-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsVisible(true);
            setIsMinimized(false);
          }}
          className="h-8 px-3 text-xs font-mono font-bold bg-background/95 backdrop-blur-md border-primary/40 text-primary shadow-lg hover:bg-primary/10 gap-1.5"
          title="Open Hackathon Demo Walkthrough (Ctrl + D)"
        >
          <Presentation className="w-3.5 h-3.5 text-primary" />
          <span>Demo Walkthrough (Ctrl+D)</span>
        </Button>
      </div>
    );
  }

  // Minimized floating pill mode
  if (isMinimized) {
    return (
      <div className="mb-4 p-2.5 rounded-xl border border-primary/30 bg-card/95 backdrop-blur-md shadow-md flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-primary/20 text-primary">
            <Presentation className="w-4 h-4" />
          </div>
          <span className="font-bold text-foreground">3-Min Live Demo Mode:</span>
          <span className="text-primary font-semibold">
            {isComplete ? "Completed" : `Step ${currentStep}/7: ${DEMO_STEPS[currentStep - 1]?.title}`}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep <= 1 && !isComplete}
            className="h-7 px-2 text-xs"
          >
            Prev
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleNext}
            className="h-7 px-2.5 text-xs font-bold"
          >
            {isComplete ? "Done" : "Next &rarr;"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(false)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Expand Walkthrough (Ctrl + D)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Hide Walkthrough"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-6 rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 p-4 sm:p-5 shadow-xl transition-all duration-200">
      {/* Top Banner Control Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-border/70">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30">
            <Presentation className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs md:text-sm font-bold font-mono text-foreground uppercase tracking-wider">
                Hackathon Evaluation Demo Walkthrough
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                3-Minute Pitch Mode
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              Press <kbd className="px-1 py-0.2 bg-secondary border border-border rounded text-[10px]">Ctrl+D</kbd> to minimize &bull; <kbd className="px-1 py-0.2 bg-secondary border border-border rounded text-[10px]">&rarr;</kbd> Next &bull; <kbd className="px-1 py-0.2 bg-secondary border border-border rounded text-[10px]">&larr;</kbd> Prev &bull; <kbd className="px-1 py-0.2 bg-secondary border border-border rounded text-[10px]">1..7</kbd> Jump
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-7 px-2 text-xs font-mono gap-1 text-muted-foreground hover:text-foreground hidden md:inline-flex"
            title="Auto-Fill canonical GRID-101 Scenario"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Minimize Bar"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Close Bar"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Step Card Content */}
      <DemoStepCard
        currentStep={currentStep}
        onSelectStep={handleSelectStep}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
        isComplete={isComplete}
      />
    </div>
  );
}
