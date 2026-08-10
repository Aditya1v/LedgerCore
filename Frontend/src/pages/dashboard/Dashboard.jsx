import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { fetchDashboardSummary } from "../../services/dashboardService";
import { getAccounts } from "../../services/accountService";
import { getTransactionDetails } from "../../services/transactionService";

import PageContainer from "../../components/ui/PageContainer";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import SummaryCards from "../../components/dashboard/SummaryCards";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import AccountsOverview from "../../components/dashboard/AccountsOverview";
import TransactionDetailsModal from "../../components/transactions/TransactionDetailsModal";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardSummary();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAccounts = async () => {
    try {
      setAccountsLoading(true);
      const response = await getAccounts();
      setAccounts(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAccountsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadAccounts();
  }, []);

  const handleTransactionClick = async (transactionId) => {
    try {
      setLoadingDetails(true);
      const transaction = await getTransactionDetails(transactionId);
      setSelectedTransaction(transaction);
      setIsDetailsOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) return <Loader label="Loading dashboard" />;

  if (error) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-line bg-surface px-8 py-20 text-center">
          <AlertTriangle size={28} className="text-negative" />
          <div>
            <p className="text-[15px] font-semibold text-ink">Something went wrong</p>
            <p className="mt-1 text-sm text-ink-faint">We couldn't load your dashboard. Please try again.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={loadDashboard}>
            Retry
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (!dashboardData) return null;

  return (
    <PageContainer>
      <DashboardHeader />

      <SummaryCards dashboardData={dashboardData} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentTransactions
            transactions={dashboardData.recentTransactions}
            onTransactionClick={handleTransactionClick}
          />
        </div>

        <AccountsOverview accounts={accounts} loading={accountsLoading} />
      </div>

      <TransactionDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        transaction={selectedTransaction}
        loading={loadingDetails}
      />
    </PageContainer>
  );
}

export default Dashboard;
