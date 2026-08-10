import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { cn } from "../../utils/cn";

function TransactionItem({ transaction, onClick }) {
  const isIncome = transaction.direction === "IN";
  const isPending = transaction.status === "PENDING";

  return (
    <button
      type="button"
      onClick={onClick ? () => onClick(transaction._id) : undefined}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-control px-3 py-3.5 text-left transition-colors",
        onClick && "cursor-pointer hover:bg-surface-hover"
      )}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-control",
            isIncome ? "bg-positive-soft" : "bg-negative-soft"
          )}
        >
          {isIncome ? (
            <ArrowDownLeft size={18} className="text-positive" />
          ) : (
            <ArrowUpRight size={18} className="text-negative" />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-[14.5px] font-medium text-ink">{transaction.category}</h3>
          <p className="mt-0.5 truncate text-[13px] text-ink-faint">
            {transaction.transactionType}
            {" · "}
            {new Date(transaction.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className={cn("financial-figure text-[14.5px] font-semibold", isIncome ? "text-positive" : "text-negative")}>
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
        {isPending && <p className="mt-0.5 text-[11px] font-medium text-warning">Pending</p>}
      </div>
    </button>
  );
}

export default TransactionItem;
