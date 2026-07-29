import { useEffect, useState } from "react";
import { fetchDashboardSummary } from "../../services/dashboardService";
import SummaryCards from "../../components/dashboard/SummaryCards";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import RecentTransactions from "../../components/dashboard/RecentTransactions";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await fetchDashboardSummary();

      setDashboardData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong.</div>;
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="space-y-8">
      <DashboardHeader />
      <SummaryCards dashboardData={dashboardData} />
      <RecentTransactions transactions={dashboardData.recentTransactions} />
    </div>
  );
}

export default Dashboard;
