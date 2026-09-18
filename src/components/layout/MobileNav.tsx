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
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Menu,
  Zap,
  LayoutDashboard,
  CalendarClock,
  ShieldCheck,
  Palette,
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
  { label: "Design System", href: "/design-system", icon: Palette },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] flex flex-col p-6">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 text-base font-bold">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Zap className="w-4 h-4" />
            </div>
            <span>GridWise Nav</span>
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

        <nav className="flex-1 space-y-1 py-2 border-t border-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
