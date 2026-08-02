import DashboardCard from "../cards/DashboardCard";
import { Wallet, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function SummaryCards({ monthlyData }) {
  const totalIncome = monthlyData.reduce(
    (sum, item) => sum + item.income,
    0
  );

  const totalExpense = monthlyData.reduce(
    (sum, item) => sum + item.expense,
    0
  );

  const netSavings = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <DashboardCard
        title="Total Income"
        value={formatCurrency(totalIncome)}
        icon={
          <TrendingUp
            className="text-green-400"
            size={24}
          />
        }
      />

      <DashboardCard
        title="Total Expense"
        value={formatCurrency(totalExpense)}
        icon={
          <TrendingDown
            className="text-red-400"
            size={24}
          />
        }
      />

      <DashboardCard
        title="Net Savings"
        value={formatCurrency(netSavings)}
        icon={
          <Wallet
            className="text-blue-400"
            size={24}
          />
        }
      />
    </div>
  );
}

export default SummaryCards;