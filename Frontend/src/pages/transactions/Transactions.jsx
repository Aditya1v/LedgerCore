import { useEffect, useState } from "react";
import { getTransactions } from "../../services/transactionService";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await getTransactions();

      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) return <Loader />;

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No Transactions Yet"
        description="Your transactions will appear here."
      />
    );
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-white">
        Transactions
      </h1>

      <p className="mt-2 text-slate-400">
        Total Transactions: {transactions.length}
      </p>
    </div>
  );
}

export default Transactions;