import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-normal tracking-[0.1em] uppercase transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border-[#3A4B40] bg-[#1B241F] text-[#E5B25D]",
        gold:
          "border-[#E5B25D]/40 bg-[#E5B25D]/10 text-[#E5B25D]",
        secondary:
          "border-border bg-secondary text-secondary-foreground",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive",
        outline:
          "text-muted-foreground border-border bg-transparent",
        // Status Variants
        success:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
        warning:
          "border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-[#E5B25D]",
        danger:
          "border-rose-500/30 bg-rose-500/10 text-rose-500 dark:text-rose-400",
        info:
          "border-slate-500/30 bg-slate-500/10 text-slate-400",
        // Energy Domain Variants
        solar:
          "border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-[#E5B25D]",
        battery:
          "border-teal-500/30 bg-teal-500/10 text-teal-500 dark:text-teal-400",
        grid:
          "border-slate-500/30 bg-slate-500/10 text-slate-400",
        demand:
          "border-rose-500/30 bg-rose-500/10 text-rose-500 dark:text-rose-400",
        tariff:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
        // Directive Canonical Variants
        directive_solar:
          "border-amber-500/40 bg-amber-500/10 text-[#E5B25D]",
        directive_reserve:
          "border-teal-500/40 bg-teal-500/10 text-teal-400",
        directive_nocharge:
          "border-purple-500/40 bg-purple-500/10 text-purple-400",
        directive_nodischarge:
          "border-rose-500/40 bg-rose-500/10 text-rose-400",
        directive_gridcap:
          "border-slate-500/40 bg-slate-500/10 text-slate-300",
        directive_noop:
          "border-border bg-secondary/50 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
