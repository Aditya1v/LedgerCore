import { Link } from "react-router-dom";
import { ArrowRight, Receipt } from "lucide-react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import TransactionItem from "../common/TransactionItem";

function RecentTransactions({ transactions, onTransactionClick }) {
  return (
    <Card padding="p-0">
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <h2 className="text-[17px] font-semibold text-ink">Recent Transactions</h2>

        <Link
          to="/transactions"
          className="flex items-center gap-1 text-sm font-medium text-accent-hover transition-colors hover:text-accent"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={Receipt}
            title="No transactions yet"
            description="Transfer money between accounts to see your activity here."
          />
        </div>
      ) : (
        <div className="p-3">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction._id}
              transaction={transaction}
              onClick={onTransactionClick}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

export default RecentTransactions;
