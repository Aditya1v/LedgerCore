import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * The dashboard's single "bold" element. Everything here is derived from
 * real summary data — there's no historical balance series from the API,
 * so instead of faking a month-over-month percentage, the visual compares
 * total inflow vs. outflow, which is honest and still communicates shape.
 */
function HeroBalanceCard({ totalBalance, totalIncome, totalExpense }) {
  const net = totalIncome - totalExpense;
  const total = totalIncome + totalExpense;
  const incomeShare = total > 0 ? (totalIncome / total) * 100 : 50;
  const isPositiveNet = net > 0;
  const isFlatNet = net === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-card-lg border border-line bg-surface p-7 shadow-card sm:p-8"
    >
      <div className="bg-grid-fade pointer-events-none absolute inset-0" />

      <div className="relative flex items-start justify-between">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">Total Balance</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-control bg-accent-soft">
          <Wallet size={19} className="text-accent-hover" />
        </div>
      </div>

      <p className="financial-figure relative mt-4 text-[40px] font-bold leading-none text-ink sm:text-[46px]">
        {formatCurrency(totalBalance)}
      </p>

      <div
        className={`relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${
          isFlatNet ? "text-ink-faint" : isPositiveNet ? "text-positive" : "text-negative"
        }`}
      >
        {isFlatNet ? <Minus size={15} /> : isPositiveNet ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
        Net position {isPositiveNet && !isFlatNet ? "+" : ""}
        {formatCurrency(net)}
      </div>

      {/* Income vs. expense proportion — real data, no fabricated history */}
      <div className="relative mt-6">
        <div className="flex h-2 w-full overflow-hidden rounded-pill bg-surface-3">
          <div className="h-full bg-positive" style={{ width: `${incomeShare}%` }} />
          <div className="h-full bg-negative" style={{ width: `${100 - incomeShare}%` }} />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-positive" />
            Income {formatCurrency(totalIncome)}
          </span>
          <span className="flex items-center gap-1.5 text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-negative" />
            Expenses {formatCurrency(totalExpense)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default HeroBalanceCard;
