import { useState } from "react";
import { ArrowDown, Check, Copy, Download } from "lucide-react";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Loader from "../ui/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import { generateTransactionReceipt } from "../../utils/generateTransactionReceipt";

const STATUS_VARIANT = {
  COMPLETED: "positive",
  PENDING: "warning",
  FAILED: "negative",
};

function DetailRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-ink-faint">{label}</span>
      <span className={`text-sm font-medium text-ink ${valueClass}`}>{value}</span>
    </div>
  );
}

function TransactionDetailsModal({ isOpen, onClose, transaction, loading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!transaction) return;
    await navigator.clipboard.writeText(transaction._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      size="xl"
      headerAction={
        transaction && (
          <Button
            size="sm"
            variant="secondary"
            icon={Download}
            onClick={() => generateTransactionReceipt(transaction)}
          >
            Receipt
          </Button>
        )
      }
    >
      {loading || !transaction ? (
        <Loader />
      ) : (
        <div className="space-y-8">
          {/* Summary */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">Summary</h3>
              <Badge variant={STATUS_VARIANT[transaction.status] || "neutral"}>{transaction.status}</Badge>
            </div>

            <div className="mt-3 rounded-card border border-line bg-surface-2 px-5">
              <DetailRow
                label="Amount"
                value={<span className="financial-figure text-base">{formatCurrency(transaction.amount)}</span>}
              />
              <div className="h-px bg-line" />
              <DetailRow label="Direction" value={transaction.direction === "IN" ? "Incoming" : "Outgoing"} />
              <div className="h-px bg-line" />
              <DetailRow label="Type" value={transaction.transactionType} />
              <div className="h-px bg-line" />
              <DetailRow label="Category" value={transaction.category} />
              <div className="h-px bg-line" />
              <DetailRow label="Currency" value={transaction.fromAccount.currency} />
              <div className="h-px bg-line" />
              <DetailRow label="Date" value={new Date(transaction.createdAt).toLocaleString()} />
              <div className="h-px bg-line" />
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm text-ink-faint">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="max-w-[180px] truncate text-xs text-ink-muted sm:max-w-[240px]">
                    {transaction._id}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex h-7 w-7 items-center justify-center rounded-control text-ink-faint transition-colors hover:bg-surface-3 hover:text-ink"
                    aria-label="Copy transaction ID"
                  >
                    {copied ? <Check size={14} className="text-positive" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Money flow */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">Money Flow</h3>

            <div className="mt-3 space-y-3">
              <div className="rounded-card border border-negative-line bg-negative-soft/40 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">From</p>
                <p className="mt-2 text-lg font-semibold text-ink">{transaction.fromAccount.name}</p>
                <p className="text-sm text-ink-faint">{transaction.fromAccount.currency}</p>
              </div>

              <div className="flex flex-col items-center gap-1 py-1">
                <ArrowDown size={20} className="text-ink-faint" />
                <span className="financial-figure text-lg font-bold text-ink">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>

              <div className="rounded-card border border-positive-line bg-positive-soft/40 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">To</p>
                <p className="mt-2 text-lg font-semibold text-ink">{transaction.toAccount.name}</p>
                <p className="text-sm text-ink-faint">{transaction.toAccount.currency}</p>
              </div>
            </div>
          </section>

          {/* Ledger */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">Ledger Entries</h3>

            <div className="mt-3 space-y-3">
              {transaction.ledgerEntries.map((entry) => (
                <div
                  key={entry._id}
                  className={`rounded-card border p-5 ${
                    entry.type === "DEBIT" ? "border-negative-line bg-negative-soft/20" : "border-positive-line bg-positive-soft/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={entry.type === "DEBIT" ? "negative" : "positive"}>{entry.type}</Badge>
                    <span className="financial-figure text-base font-bold text-ink">
                      {formatCurrency(entry.amount)}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-ink-faint">Account</p>
                    <p className="mt-0.5 text-[15px] font-medium text-ink">{entry.account.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </Modal>
  );
}

export default TransactionDetailsModal;
