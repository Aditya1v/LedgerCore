import { useEffect, useState } from "react";

import Loader from "../../components/ui/Loader";
import { getAnalytics } from "../../services/analytics.service";

import SummaryCards from "../../components/analytics/SummaryCards";
import FinancialStats from "../../components/analytics/FinancialStats";
import CashFlowChart from "../../components/analytics/CashFlowChart";
import IncomeExpenseChart from "../../components/analytics/IncomeExpenseChart";
import CategorySpendingChart from "../../components/analytics/CategorySpendingChart";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await getAnalytics();
        setAnalytics(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) return <Loader />;

  const totalIncome = analytics.monthlyData.reduce(
    (sum, item) => sum + item.income,
    0
  );

  const totalExpense = analytics.monthlyData.reduce(
    (sum, item) => sum + item.expense,
    0
  );

  return (
    <div>
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white">Analytics</h1>
        <p className="mt-2 text-slate-400">
          Financial insights and spending overview
        </p>
      </div>

      {/* Top Summary Cards */}
      <SummaryCards monthlyData={analytics.monthlyData} />

      {/* Statistics Cards */}
      <FinancialStats
        transactionCount={analytics.transactionCount}
        averageTransaction={analytics.averageTransaction}
        largestIncome={analytics.largestIncome}
        largestExpense={analytics.largestExpense}
      />

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* Cash Flow */}
        <div className="xl:col-span-2">
          <CashFlowChart data={analytics.monthlyData} />
        </div>

        {/* Pie Chart */}
        <div className="xl:col-span-2">
          <IncomeExpenseChart
            income={totalIncome}
            expense={totalExpense}
          />
        </div>

        {/* Full Width Category Spending */}
        <div className="xl:col-span-4">
          <CategorySpendingChart
            data={analytics.categorySpending}
          />
        </div>
      </div>
    </div>
  );
}

export default Analytics;