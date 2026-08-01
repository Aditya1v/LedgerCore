import Card from "../ui/Card";
import TransactionItem from "../common/TransactionItem";

function RecentTransactions({ transactions }) {
  // console.log(transactions[0]);
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">
          Recent Transactions
        </h2>
        <div className="mt-6">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction._id} transaction={transaction} />
          ))}
        </div>
        

        <button className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300">
          View All →
        </button>
      </div>
    </Card>
  );
}

export default RecentTransactions;
