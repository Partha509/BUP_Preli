"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  tag: string;
  href: string;
}

const dropdownItems: DropdownItem[] = [
  { label: "24h Dispatch Schedule", tag: "LP SOLVER", href: "/dashboard#schedule" },
  { label: "Operator Directives", tag: "LLM GUARD", href: "/dashboard#directives" },
  { label: "Design System Specs", tag: "TOKENS", href: "/design-system" },
  { label: "API Health Monitor", tag: "STATUS", href: "/health" },
];

export function AppHeader({
  onRunOptimization,
  onToggleAiAssistant,
}: {
  onRunOptimization?: () => void;
  onToggleAiAssistant?: () => void;
}) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOverviewActive = pathname === "/";
  const isDashboardActive = pathname === "/dashboard";
  const isScheduleActive = pathname === "/design-system";

  return (
    <header className="sticky top-3 sm:top-5 z-40 w-full px-3 sm:px-6 pointer-events-none flex justify-center">
      <nav
        aria-label="Primary Navigation"
        className="pointer-events-auto relative inline-flex items-center justify-between gap-3 sm:gap-5 md:gap-6 lg:gap-8 px-3.5 sm:px-5 lg:px-6 h-11 sm:h-12 rounded-full border border-[#2D3A32] bg-[#0E1311] shadow-[0_8px_30px_rgba(0,0,0,0.32)] transition-colors select-none"
      >
        {/* 1. Logo / Wordmark */}
        <Link
          href="/"
          className="flex items-center tracking-tight select-none focus-visible:outline-none shrink-0 hover:opacity-90 transition-opacity"
          aria-label="GridWise Home"
        >
          <span className="font-semibold text-[13px] sm:text-[14px] text-[#F3F5F4] tracking-tight">Grid</span>
          <span className="font-light text-[13px] sm:text-[14px] text-[#E5B25D] tracking-tight ml-0.5">Wise</span>
        </Link>

        {/* 2 & 3. Desktop Navigation Links & Active Pill */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2">
          {/* OVERVIEW */}
          {isOverviewActive ? (
            <span className="px-3.5 py-1 rounded-full text-[12px] tracking-[0.12em] font-normal text-[#E5B25D] bg-[#1B241F] border border-[#3A4B40] shadow-xs select-none">
              OVERVIEW
            </span>
          ) : (
            <Link
              href="/"
              className="px-2.5 py-1 text-[12px] font-normal tracking-[0.12em] uppercase text-[#9EA8A2] hover:text-[#E2EAE5] transition-colors"
            >
              OVERVIEW
            </Link>
          )}

          {/* DASHBOARD */}
          {isDashboardActive ? (
            <span className="px-3.5 py-1 rounded-full text-[12px] tracking-[0.12em] font-normal text-[#E5B25D] bg-[#1B241F] border border-[#3A4B40] shadow-xs select-none">
              DASHBOARD
            </span>
          ) : (
            <Link
              href="/dashboard"
              className="px-2.5 py-1 text-[12px] font-normal tracking-[0.12em] uppercase text-[#9EA8A2] hover:text-[#E2EAE5] transition-colors"
            >
              DASHBOARD
            </Link>
          )}

          {/* 4. Dropdown Navigation: SCHEDULE with small downward chevron */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setDropdownOpen(false);
              }}
              className={cn(
                "inline-flex items-center gap-1 text-[12px] tracking-[0.12em] uppercase transition-colors select-none focus-visible:outline-none cursor-pointer",
                isScheduleActive
                  ? "px-3.5 py-1 rounded-full text-[#E5B25D] bg-[#1B241F] border border-[#3A4B40]"
                  : "px-2.5 py-1 font-normal text-[#9EA8A2] hover:text-[#E2EAE5]"
              )}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <span>SCHEDULE</span>
              <ChevronDown
                className={cn(
                  "w-3 h-3 stroke-[1.75] opacity-75 transition-transform duration-150",
                  dropdownOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-56 rounded-2xl border border-[#2D3A32] bg-[#0E1311] p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.5)] z-50 flex flex-col gap-0.5"
                role="menu"
              >
                {dropdownItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-[11.5px] font-normal tracking-wide text-[#9EA8A2] hover:text-[#F4F6F5] hover:bg-[#1A231E] transition-colors"
                    role="menuitem"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] font-mono text-[#E5B25D]/75">{item.tag}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 5. Contact CTA: Gold text, not inside an active pill, CTA-style text link */}
          <Link
            href="#contact"
            className="px-2.5 py-1 text-[12px] font-medium tracking-[0.12em] uppercase text-[#E5B25D] hover:text-[#F3CA7E] transition-colors select-none cursor-pointer focus-visible:outline-none"
          >
            CONTACT
          </Link>
        </div>

        {/* Right Section / Mobile Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Contact link */}
          <Link
            href="#contact"
            className="md:hidden px-2 py-1 text-[11.5px] font-medium tracking-[0.12em] uppercase text-[#E5B25D] hover:text-[#F3CA7E] transition-colors"
          >
            CONTACT
          </Link>

          {/* Mobile Navigation Drawer Trigger */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  );
}
