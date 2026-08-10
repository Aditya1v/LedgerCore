import { cn } from "../../utils/cn";

const VARIANTS = {
  positive: "bg-positive-soft text-positive",
  negative: "bg-negative-soft text-negative",
  warning: "bg-warning-soft text-warning",
  accent: "bg-accent-soft text-accent-hover",
  neutral: "bg-surface-3 text-ink-muted",
};

const DOT_VARIANTS = {
  positive: "bg-positive",
  negative: "bg-negative",
  warning: "bg-warning",
  accent: "bg-accent",
  neutral: "bg-ink-faint",
};

function Badge({ children, variant = "neutral", dot = false, className = "" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold tracking-wide",
        VARIANTS[variant],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", DOT_VARIANTS[variant])} />}
      {children}
    </span>
  );
}

export default Badge;
