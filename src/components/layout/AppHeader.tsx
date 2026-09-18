"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Sparkles, Play, LayoutDashboard, CalendarClock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HealthBadge } from "@/components/energy/HealthBadge";
import { ApiModeBadge } from "@/components/energy/ApiModeBadge";
import { RoleSwitcher } from "@/components/energy/RoleSwitcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileNav } from "@/components/layout/MobileNav";

export function AppHeader({
  onRunOptimization,
  onToggleAiAssistant,
}: {
  onRunOptimization?: () => void;
  onToggleAiAssistant?: () => void;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Overview", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "24h Schedule", href: "/dashboard#schedule" },
    { label: "Directives", href: "/dashboard#directives" },
    { label: "Design System", href: "/design-system" },
  ];

  const handleQuickOptimize = () => {
    if (onRunOptimization) {
      onRunOptimization();
    } else {
      // Dispatch custom event for dashboard listeners
      window.dispatchEvent(new CustomEvent("gridwise-run-optimization"));
    }
  };

  const handleAiClick = () => {
    if (onToggleAiAssistant) {
      onToggleAiAssistant();
    } else {
      window.dispatchEvent(new CustomEvent("gridwise-toggle-ai"));
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-border transition-all duration-200 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-xs"
          : "bg-background/70 backdrop-blur-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity & Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity"
          >
            <div className="p-1.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              <Zap className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-base md:text-lg">GridWise</span>
            <span className="hidden sm:inline text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
              24h Solver
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Telemetry, Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live vs Mock Mode Switcher */}
          <div className="hidden sm:inline-flex">
            <ApiModeBadge />
          </div>

          {/* Health Badge */}
          <div className="hidden sm:inline-flex">
            <HealthBadge />
          </div>

          {/* Role Switcher Pill */}
          <div className="hidden md:inline-flex">
            <RoleSwitcher />
          </div>

          {/* Quick Action Button: Run Optimization */}
          <Button
            size="sm"
            variant="default"
            onClick={handleQuickOptimize}
            className="h-8 px-3 text-xs hidden sm:inline-flex items-center gap-1.5 font-semibold"
            title="Trigger POST /optimize-energy for active scenario"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Optimize</span>
          </Button>

          {/* AI Copilot Trigger */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleAiClick}
            className="h-8 px-2.5 text-xs inline-flex items-center gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            title="Open GridWise AI Assistant"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="hidden md:inline">Copilot</span>
          </Button>

          {/* Theme Toggle */}
          <div className="hidden sm:inline-flex">
            <ThemeToggle />
          </div>

          {/* Mobile Navigation Drawer Trigger */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
