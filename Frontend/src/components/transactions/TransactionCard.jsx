import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

function TransactionCard({ transaction }) {
  const isCredit = transaction.transactionType === "DEPOSIT";

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg hover:border-blue-500 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-full ${
              isCredit
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {isCredit ? (
              <ArrowDownLeft size={20} />
            ) : (
              <ArrowUpRight size={20} />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              {transaction.category}
            </h3>

            <p className="text-slate-400 text-sm">
              {transaction.transactionType}
            </p>
          </div>
        </div>

        <div className="text-right">
          <h2
            className={`text-2xl font-bold ${
              isCredit ? "text-green-400" : "text-red-400"
            }`}
          >
            {isCredit ? "+" : "-"}₹
            {transaction.amount.toLocaleString()}
          </h2>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              transaction.status === "COMPLETED"
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {transaction.status}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-700 pt-4 text-sm text-slate-400 space-y-2">
        <div className="flex justify-between">
          <span>From</span>

          <span className="text-white">
            {transaction.fromAccount?.name || "Deleted Account"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>To</span>

          <span className="text-white">
            {transaction.toAccount?.name || "Deleted Account"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Date</span>

          <span>
            {new Date(transaction.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TransactionCard;