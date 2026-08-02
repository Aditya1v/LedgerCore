import { useEffect, useState } from "react";
import Loader from "../../components/ui/Loader";
import { getAnalytics } from "../../services/analytics.service";
import SummaryCards from "../../components/analytics/SummaryCards";
import CashFlowChart from "../../components/analytics/CashFlowChart";
import IncomeExpenseChart from "../../components/analytics/IncomeExpenseChart";

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

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white">Analytics</h1>

      <SummaryCards monthlyData={analytics.monthlyData} />
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <CashFlowChart data={analytics.monthlyData} />
        </div>

        <div>
          <IncomeExpenseChart
            income={analytics.monthlyData.reduce(
              (sum, item) => sum + item.income,
              0,
            )}
            expense={analytics.monthlyData.reduce(
              (sum, item) => sum + item.expense,
              0,
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
