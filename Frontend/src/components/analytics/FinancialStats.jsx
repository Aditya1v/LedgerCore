import { ArrowDownCircle, ArrowUpCircle, BarChart3, Receipt } from "lucide-react";
import DashboardCard from "../cards/DashboardCard";
import { formatCurrency } from "../../utils/formatCurrency";

function FinancialStats({ transactionCount, averageTransaction, largestIncome, largestExpense }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title="Transactions"
        value={transactionCount}
        tone="accent"
        icon={<Receipt size={18} />}
      />

      <DashboardCard
        title="Average Transaction"
        value={formatCurrency(averageTransaction)}
        tone="warning"
        icon={<BarChart3 size={18} />}
      />

      <DashboardCard
        title="Largest Income"
        value={formatCurrency(largestIncome)}
        tone="positive"
        icon={<ArrowUpCircle size={18} />}
      />

      <DashboardCard
        title="Largest Expense"
        value={formatCurrency(largestExpense)}
        tone="negative"
        icon={<ArrowDownCircle size={18} />}
      />
    </div>
  );
}

export default FinancialStats;
