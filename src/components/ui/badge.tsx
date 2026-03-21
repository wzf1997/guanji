import * as React from "react";
import { cn } from "@/lib/utils";

// ==========================================
//  Badge — status / tag chip primitive
// ==========================================

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "error" | "gold" | "outline";
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "bg-[var(--primary)] text-white",
  secondary:
    "bg-[var(--secondary)] text-[var(--foreground)]",
  success:
    "bg-[var(--success)] text-[#1A4A1A]",
  error:
    "bg-[var(--error)] text-[#4A1A1A]",
  gold:
    "text-[#7A4A00]",
  outline:
    "border border-[var(--border)] text-[var(--muted-foreground)] bg-transparent",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", style, ...props }, ref) => {
    const isGold = variant === "gold";
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-medium leading-none",
          variantStyles[variant],
          className
        )}
        style={
          isGold
            ? { background: "var(--gold-light)", color: "#7A4A00", ...style }
            : style
        }
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
