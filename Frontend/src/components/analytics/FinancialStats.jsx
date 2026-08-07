import DashboardCard from "../cards/DashboardCard";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  BarChart3,
  Receipt,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function FinancialStats({
  transactionCount,
  averageTransaction,
  largestIncome,
  largestExpense,
}) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title="Transactions"
        value={transactionCount}
        icon={<Receipt className="text-blue-400" size={24} />}
      />

      <DashboardCard
        title="Average Transaction"
        value={formatCurrency(averageTransaction)}
        icon={<BarChart3 className="text-yellow-400" size={24} />}
      />

      <DashboardCard
        title="Largest Income"
        value={formatCurrency(largestIncome)}
        icon={<ArrowUpCircle className="text-green-400" size={24} />}
      />

      <DashboardCard
        title="Largest Expense"
        value={formatCurrency(largestExpense)}
        icon={<ArrowDownCircle className="text-red-400" size={24} />}
      />
    </div>
  );
}

export default FinancialStats;