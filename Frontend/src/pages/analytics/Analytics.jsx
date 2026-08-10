import { useEffect, useState } from "react";

import Loader from "../../components/ui/Loader";
import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
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

  if (loading) return <Loader label="Loading analytics" />;
  if (!analytics) return null;

  const totalIncome = analytics.monthlyData.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = analytics.monthlyData.reduce((sum, item) => sum + item.expense, 0);

  return (
    <PageContainer wide>
      <PageHeader title="Analytics" subtitle="Understand your financial activity and cash flow." />

      <SummaryCards monthlyData={analytics.monthlyData} />

      <FinancialStats
        transactionCount={analytics.transactionCount}
        averageTransaction={analytics.averageTransaction}
        largestIncome={analytics.largestIncome}
        largestExpense={analytics.largestExpense}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <CashFlowChart data={analytics.monthlyData} />
        </div>

        <div className="xl:col-span-2">
          <IncomeExpenseChart income={totalIncome} expense={totalExpense} />
        </div>

        <div className="xl:col-span-4">
          <CategorySpendingChart data={analytics.categorySpending} />
        </div>
      </div>
    </PageContainer>
  );
}

export default Analytics;
