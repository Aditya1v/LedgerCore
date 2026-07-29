import DashboardCard from "../cards/DashboardCard";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Landmark,
} from "lucide-react";


function SummaryCards({ dashboardData }) {
  const cards = [
    {
      title: "Total Balance",
      value: formatCurrency(dashboardData.totalBalance),
      icon: <Wallet size={22} className="text-blue-400" />,
    },
    {
      title: "Total Income",
      value: formatCurrency(dashboardData.totalIncome),
      icon: <TrendingUp size={22} className="text-green-400" />,
    },
    {
      title: "Total Expense",
      value: formatCurrency(dashboardData.totalExpense),
      icon: <TrendingDown size={22} className="text-red-400" />,
    },
    {
      title: "Accounts",
      value: dashboardData.totalAccounts,
      icon: <Landmark size={22} className="text-yellow-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <DashboardCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </div>
  );
}

export default SummaryCards;