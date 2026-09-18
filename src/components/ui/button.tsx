import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#1B241F] text-[#E5B25D] border border-[#3A4B40] hover:bg-[#25322B] hover:text-[#F3CA7E] hover:border-[#4B5F52] shadow-xs",
        gold:
          "bg-[#E5B25D] text-[#0E1311] font-semibold border border-[#E5B25D] hover:bg-[#F3CA7E] hover:border-[#F3CA7E] shadow-xs",
        destructive:
          "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25",
        outline:
          "border border-border bg-card/40 text-foreground hover:bg-secondary hover:border-strong-border",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
        link:
          "text-[#E5B25D] underline-offset-4 hover:underline",
        // Energy Domain Accent Buttons
        solar:
          "bg-amber-500/10 text-amber-400 border border-amber-500/25 hover:bg-amber-500/20",
        battery:
          "bg-teal-500/10 text-teal-400 border border-teal-500/25 hover:bg-teal-500/20",
        grid:
          "bg-slate-500/10 text-slate-400 border border-slate-500/25 hover:bg-slate-500/20",
      },
      size: {
        default: "h-8 sm:h-9 px-4 py-1.5",
        sm: "h-7 sm:h-8 px-3 text-[11px]",
        lg: "h-9 sm:h-10 px-6 text-xs",
        icon: "h-8 w-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
