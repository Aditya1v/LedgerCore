import { useEffect, useState } from "react";
import { getTransactions } from "../../services/transactionService";

import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import TransactionCard from "../../components/transactions/TransactionCard";
import TransferMoneyModal from "../../components/transactions/TransferMoneyModal";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});

  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 5;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [direction, setDirection] = useState("");
  const [sort, setSort] = useState("latest");

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await getTransactions({
        page,
        limit,
        search,
        category,
        direction,
        sort,
      });

      setTransactions(response.data.transactions);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, search, category, direction, sort]);

  if (loading) return <Loader />;

  return (
    <div>
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-white">
            Transactions
          </h1>

          <p className="mt-2 text-slate-400">
            Total Transactions: {pagination.totalTransactions || 0}
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          + Transfer Money
        </button>
      </div>

      {/* Filters */}

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
        />

        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
        >
          <option value="">All Categories</option>
          <option value="Transfer">Transfer</option>
          <option value="Initial Funding">
            Initial Funding
          </option>
        </select>

        <select
          value={direction}
          onChange={(e) => {
            setPage(1);
            setDirection(e.target.value);
          }}
          className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
        >
          <option value="">All</option>
          <option value="IN">Incoming</option>
          <option value="OUT">Outgoing</option>
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
          }}
          className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="amount_desc">
            Highest Amount
          </option>
          <option value="amount_asc">
            Lowest Amount
          </option>
        </select>
      </div>

      {/* Empty */}

      {transactions.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No Transactions"
            description="No transactions found."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6">
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction._id}
              transaction={transaction}
            />
          ))}
        </div>
      )}

      {/* Pagination */}

      <div className="mt-8 flex items-center justify-center gap-4">

        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="rounded-lg bg-slate-700 px-4 py-2 text-white disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-slate-300">
          Page {pagination.page || 1} of{" "}
          {pagination.totalPages || 1}
        </span>

        <button
          disabled={page === pagination.totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="rounded-lg bg-slate-700 px-4 py-2 text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Modal */}

      <TransferMoneyModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onTransactionCreated={fetchTransactions}
      />
    </div>
  );
}

export default Transactions;