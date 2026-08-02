import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function TransactionItem({ transaction }) {
  const isIncome = transaction.direction === "IN";

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div
          className={`rounded-xl p-3 ${
            isIncome
              ? "bg-green-500/10"
              : "bg-red-500/10"
          }`}
        >
          {isIncome ? (
            <ArrowDownLeft
              className="text-green-400"
              size={20}
            />
          ) : (
            <ArrowUpRight
              className="text-red-400"
              size={20}
            />
          )}
        </div>

        <div>
          <h3 className="font-medium text-slate-100">
            {transaction.category}
          </h3>

          <p className="text-sm text-slate-400">
            {transaction.transactionType}
          </p>
        </div>
      </div>

      <p
        className={`font-semibold ${
          isIncome
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </p>
    </div>
  );
}

export default TransactionItem;