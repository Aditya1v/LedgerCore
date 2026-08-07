import { useState } from "react";

function DetailRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>

      <span className={`font-medium text-white ${valueClass}`}>{value}</span>
    </div>
  );
}

function TransactionDetailsModal({ isOpen, onClose, transaction, loading }) {
  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="rounded-xl bg-slate-900 p-8 text-white">Loading...</div>
      </div>
    );
  }

  if (!transaction) return null;

  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(transaction._id);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-800 px-8 py-6 flex-shrink-0">
          <h2 className="text-3xl font-bold text-white">Transaction Details</h2>

          <button
            onClick={onClose}
            className="text-4xl text-slate-400 transition hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Scrollable Body */}

        <div className="flex-1 overflow-y-auto px-8 py-8">
          {/* SUMMARY */}

          <section>
            <h3 className="mb-5 text-xl font-semibold text-white">
              Transaction Summary
            </h3>

            <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-6">
              <DetailRow label="Amount" value={`₹${transaction.amount}`} />

              <DetailRow
                label="Status"
                value={transaction.status}
                valueClass="text-green-400"
              />

              <DetailRow label="Direction" value={transaction.direction} />

              <DetailRow label="Type" value={transaction.transactionType} />

              <DetailRow label="Category" value={transaction.category} />

              <DetailRow
                label="Currency"
                value={transaction.fromAccount.currency}
              />

              <DetailRow
                label="Date"
                value={new Date(transaction.createdAt).toLocaleString()}
              />

              <div className="flex items-start justify-between">
                <span className="text-slate-400">Transaction ID</span>

                <span className="max-w-[260px] break-all text-right text-xs text-slate-300">
                  {transaction._id}
                </span>
                <button
                  onClick={handleCopy}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  }`}
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>
          </section>

          {/* MONEY FLOW */}

          <section className="mt-10">
            <h3 className="mb-5 text-xl font-semibold text-white">
              Money Flow
            </h3>

            <div className="space-y-5">
              <div className="rounded-xl border border-red-500/20 bg-slate-800 p-5">
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  From
                </p>

                <p className="mt-3 text-2xl font-bold text-white">
                  {transaction.fromAccount.name}
                </p>

                <p className="text-slate-400">
                  {transaction.fromAccount.currency}
                </p>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-4xl">↓</span>

                <span className="mt-2 text-2xl font-bold text-green-400">
                  ₹{transaction.amount}
                </span>
              </div>

              <div className="rounded-xl border border-green-500/20 bg-slate-800 p-5">
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  To
                </p>

                <p className="mt-3 text-2xl font-bold text-white">
                  {transaction.toAccount.name}
                </p>

                <p className="text-slate-400">
                  {transaction.toAccount.currency}
                </p>
              </div>
            </div>
          </section>

          {/* LEDGER */}

          <section className="mt-10">
            <h3 className="mb-5 text-xl font-semibold text-white">
              Ledger Entries
            </h3>

            <div className="space-y-5">
              {transaction.ledgerEntries.map((entry) => (
                <div
                  key={entry._id}
                  className={`rounded-xl border p-6 ${
                    entry.type === "DEBIT"
                      ? "border-red-500/20 bg-red-500/5"
                      : "border-green-500/20 bg-green-500/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-lg font-bold ${
                        entry.type === "DEBIT"
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {entry.type}
                    </span>

                    <span className="text-xl font-bold text-white">
                      ₹{entry.amount}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm text-slate-400">Account</p>

                    <p className="mt-1 text-xl font-semibold text-white">
                      {entry.account.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailsModal;
