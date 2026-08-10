import { TrendingUp, TrendingDown, ArrowLeftRight } from "lucide-react";
import HeroBalanceCard from "./HeroBalanceCard";
import DashboardCard from "../cards/DashboardCard";
import { formatCurrency } from "../../utils/formatCurrency";

function SummaryCards({ dashboardData }) {
  const netCashFlow = dashboardData.totalIncome - dashboardData.totalExpense;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="lg:col-span-3">
        <HeroBalanceCard
          totalBalance={dashboardData.totalBalance}
          totalIncome={dashboardData.totalIncome}
          totalExpense={dashboardData.totalExpense}
        />
      </div>

      <DashboardCard
        title="Income"
        value={formatCurrency(dashboardData.totalIncome)}
        tone="positive"
        icon={<TrendingUp size={18} />}
      />

      <DashboardCard
        title="Expenses"
        value={formatCurrency(dashboardData.totalExpense)}
        tone="negative"
        icon={<TrendingDown size={18} />}
      />

      <DashboardCard
        title="Net Cash Flow"
        value={formatCurrency(netCashFlow)}
        tone={netCashFlow >= 0 ? "positive" : "negative"}
        icon={<ArrowLeftRight size={18} />}
      />
    </div>
  );
}

export default SummaryCards;
