import { useEffect, useState } from "react";
import { getTransactions } from "../../services/transactionService";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import TransactionCard from "../../components/transactions/TransactionCard";
import TransferMoneyModal from "../../components/transactions/TransferMoneyModal";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-white">Transactions</h1>

          <p className="mt-2 text-slate-400">
            Total Transactions: {transactions.length}
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl text-white font-semibold transition"
        >
          + Transfer Money
        </button>
      </div>

      <div className="grid gap-6 mt-8">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction._id} transaction={transaction} />
        ))}
      </div>
      <TransferMoneyModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onTransactionCreated={fetchTransactions}
      />
    </div>
  );
}

export default Transactions;
