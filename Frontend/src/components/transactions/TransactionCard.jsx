import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Badge from "../ui/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { cn } from "../../utils/cn";

const STATUS_VARIANT = {
  COMPLETED: "positive",
  PENDING: "warning",
  FAILED: "negative",
};

function TransactionCard({ transaction, onClick }) {
  const isCredit = transaction.direction === "IN";

  return (
    <motion.button
      type="button"
      onClick={() => onClick(transaction._id)}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      className="w-full rounded-card border border-line bg-surface p-5 text-left shadow-card transition-colors hover:border-line-strong hover:bg-surface-hover sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-control",
              isCredit ? "bg-positive-soft" : "bg-negative-soft"
            )}
          >
            {isCredit ? (
              <ArrowDownLeft size={19} className="text-positive" />
            ) : (
              <ArrowUpRight size={19} className="text-negative" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold text-ink">{transaction.category}</h3>
            <p className="mt-0.5 truncate text-[13px] text-ink-faint">{transaction.transactionType}</p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className={cn("financial-figure text-lg font-bold", isCredit ? "text-positive" : "text-negative")}>
            {isCredit ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
          <Badge variant={STATUS_VARIANT[transaction.status] || "neutral"} className="mt-1.5">
            {transaction.status}
          </Badge>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4 text-[13px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <span className="truncate">
          <span className="text-ink-muted">{transaction.fromAccount?.name || "Deleted account"}</span>
          {" → "}
          <span className="text-ink-muted">{transaction.toAccount?.name || "Deleted account"}</span>
        </span>
        <span className="shrink-0">{new Date(transaction.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}</span>
      </div>
    </motion.button>
  );
}

export default TransactionCard;
