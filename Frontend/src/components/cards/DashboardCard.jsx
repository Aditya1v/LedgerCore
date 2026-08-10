import { TrendingDown, TrendingUp } from "lucide-react";
import Card from "../ui/Card";
import { cn } from "../../utils/cn";

const TONES = {
  neutral: "bg-surface-3 text-ink-muted",
  accent: "bg-accent-soft text-accent-hover",
  positive: "bg-positive-soft text-positive",
  negative: "bg-negative-soft text-negative",
  warning: "bg-warning-soft text-warning",
};

/**
 * Compact metric card used across Dashboard and Analytics.
 * `trend` (optional) is a signed number (e.g. 8.4 or -3.2) rendered as a
 * percentage change badge — only pass real, computed values.
 */
function DashboardCard({ title, value, icon, tone = "neutral", trend, className = "" }) {
  const hasTrend = typeof trend === "number" && Number.isFinite(trend);
  const isPositiveTrend = trend > 0;

  return (
    <Card className={cn("h-full", className)}>
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium tracking-wide text-ink-muted">{title}</p>

        {icon && (
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-control", TONES[tone])}>
            {icon}
          </div>
        )}
      </div>

      <p className="financial-figure mt-4 text-[26px] font-bold text-ink">{value}</p>

      {hasTrend && (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 text-xs font-semibold",
            isPositiveTrend ? "text-positive" : "text-negative"
          )}
        >
          {isPositiveTrend ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {isPositiveTrend ? "+" : ""}
          {trend.toFixed(1)}%
          <span className="font-normal text-ink-faint">vs last period</span>
        </div>
      )}
    </Card>
  );
}

export default DashboardCard;
