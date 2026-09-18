"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RoleSwitcher } from "@/components/energy/RoleSwitcher";
import { HealthBadge } from "@/components/energy/HealthBadge";
import {
  Menu,
  Zap,
  LayoutDashboard,
  CalendarClock,
  ShieldCheck,
  Activity,
  Sparkles,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/", icon: Zap },
  { label: "Operations Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "24h Schedule & Charts", href: "/dashboard#schedule", icon: CalendarClock },
  { label: "Directive Inspector", href: "/dashboard#directives", icon: ShieldCheck },
  { label: "API Health Monitor", href: "/health-monitor", icon: Activity },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="w-7 h-7 rounded-full border border-[#2D3A32] bg-[#141A17] hover:bg-[#1E2622] hover:border-[#415347] text-[#A6B2AB] hover:text-[#F4F6F5] flex items-center justify-center transition-colors focus-visible:outline-none shrink-0 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-3.5 h-3.5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] flex flex-col p-6 bg-[#0E1311] border-l border-[#2D3A32] text-[#E0E6E2]">
        <SheetHeader className="border-b border-[#2D3A32] pb-4">
          <SheetTitle className="flex items-center gap-1.5 text-base select-none">
            <span className="font-semibold text-[15px] text-[#F3F5F4] tracking-tight">Grid</span>
            <span className="font-light text-[15px] text-[#E5B25D] tracking-tight">Wise</span>
          </SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Role Perspective
            </span>
            <RoleSwitcher className="w-full justify-between" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              API Status
            </span>
            <div>
              <HealthBadge className="w-full justify-center" />
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 py-2 border-t border-[#2D3A32]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  setOpen(false);
                  if (pathname === "/dashboard" && item.href.includes("#")) {
                    const targetId = item.href.split("#")[1];
                    const el = document.getElementById(targetId);
                    if (el) {
                      e.preventDefault();
                      window.history.pushState(null, "", item.href);
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs tracking-wider uppercase transition-colors ${
                  isActive
                    ? "bg-[#1B241F] text-[#E5B25D] border border-[#3A4B40] font-normal"
                    : "text-[#9EA8A2] hover:bg-[#151D18] hover:text-[#F3F5F4]"
                }`}
              >
                <Icon className="w-4 h-4 opacity-75" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="#contact"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs tracking-wider uppercase text-[#E5B25D] hover:bg-[#151D18] font-medium transition-colors"
          >
            <span className="w-4 h-4 flex items-center justify-center text-xs">&bull;</span>
            <span>Contact Secretariat</span>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
