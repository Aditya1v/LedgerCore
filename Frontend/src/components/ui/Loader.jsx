import { cn } from "../../utils/cn";

/**
 * Full-area spinner for page/section level loading states.
 */
function Loader({ className = "", label = "Loading" }) {
  return (
    <div className={cn("flex min-h-[300px] items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line-strong border-t-accent" />
        <span className="text-xs font-medium tracking-wide text-ink-faint">{label}</span>
      </div>
    </div>
  );
}

/**
 * Rectangular skeleton block for content-shaped loading placeholders.
 */
export function Skeleton({ className = "" }) {
  return <div className={cn("animate-shimmer rounded-control", className)} />;
}

export default Loader;
