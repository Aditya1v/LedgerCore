import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import DashboardCard from "../cards/DashboardCard";
import { formatCurrency } from "../../utils/formatCurrency";

function SummaryCards({ monthlyData }) {
  const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = monthlyData.reduce((sum, item) => sum + item.expense, 0);
  const netSavings = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <DashboardCard
        title="Total Income"
        value={formatCurrency(totalIncome)}
        tone="positive"
        icon={<TrendingUp size={18} />}
      />

      <DashboardCard
        title="Total Expenses"
        value={formatCurrency(totalExpense)}
        tone="negative"
        icon={<TrendingDown size={18} />}
      />

      <DashboardCard
        title="Net Cash Flow"
        value={formatCurrency(netSavings)}
        tone={netSavings >= 0 ? "positive" : "negative"}
        icon={<Wallet size={18} />}
      />
    </div>
  );
}

export default SummaryCards;
