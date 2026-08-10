import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Receipt, Search, SendHorizontal } from "lucide-react";
import { getTransactions, getTransactionDetails } from "../../services/transactionService";

import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import TransactionCard from "../../components/transactions/TransactionCard";
import TransferMoneyModal from "../../components/transactions/TransferMoneyModal";
import TransactionDetailsModal from "../../components/transactions/TransactionDetailsModal";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 5;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [direction, setDirection] = useState("");
  const [sort, setSort] = useState("latest");

  const handleTransactionClick = async (transactionId) => {
    try {
      setLoadingDetails(true);
      const transaction = await getTransactionDetails(transactionId);
      setSelectedTransaction(transaction);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await getTransactions({ page, limit, search, category, direction, sort });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, category, direction, sort]);

  const hasActiveFilters = search || category || direction;

  return (
    <PageContainer>
      <PageHeader
        title="Transactions"
        subtitle="View and manage your complete transaction history."
        action={
          <Button icon={SendHorizontal} onClick={() => setOpenModal(true)}>
            Transfer Money
          </Button>
        }
      />

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="h-11 w-full rounded-control border border-line-strong bg-surface-2 pl-10 pr-3.5 text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent focus:ring-4 focus:ring-accent-soft"
          />
        </div>

        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          className="h-11 w-full appearance-none rounded-control border border-line-strong bg-surface-2 px-3.5 text-[14.5px] text-ink outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent-soft"
        >
          <option value="">All Categories</option>
          <option value="Transfer">Transfer</option>
          <option value="Initial Funding">Initial Funding</option>
        </select>

        <select
          value={direction}
          onChange={(e) => {
            setPage(1);
            setDirection(e.target.value);
          }}
          className="h-11 w-full appearance-none rounded-control border border-line-strong bg-surface-2 px-3.5 text-[14.5px] text-ink outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent-soft"
        >
          <option value="">All Directions</option>
          <option value="IN">Incoming</option>
          <option value="OUT">Outgoing</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-11 w-full appearance-none rounded-control border border-line-strong bg-surface-2 px-3.5 text-[14.5px] text-ink outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent-soft"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="amount_desc">Highest Amount</option>
          <option value="amount_asc">Lowest Amount</option>
        </select>
      </div>

      <p className="-mt-2 text-sm text-ink-faint">
        {pagination.totalTransactions ?? 0} transaction{pagination.totalTransactions === 1 ? "" : "s"} found
      </p>

      {/* List */}
      {loading ? (
        <Loader label="Loading transactions" />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={hasActiveFilters ? "No matching transactions" : "No transactions yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your filters or search terms."
              : "Transfer money between accounts to start building your history."
          }
        />
      ) : (
        <div className="grid gap-4">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction._id} transaction={transaction} onClick={handleTransactionClick} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && transactions.length > 0 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-control border border-line-strong text-ink-muted transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-sm text-ink-faint">
            Page {pagination.page || 1} of {pagination.totalPages || 1}
          </span>

          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-control border border-line-strong text-ink-muted transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <TransferMoneyModal isOpen={openModal} onClose={() => setOpenModal(false)} onTransactionCreated={fetchTransactions} />

      <TransactionDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        transaction={selectedTransaction}
        loading={loadingDetails}
      />
    </PageContainer>
  );
}

export default Transactions;
