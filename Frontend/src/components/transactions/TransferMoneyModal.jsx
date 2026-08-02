import TransactionForm from "../forms/TransactionForm";

function TransferMoneyModal({
  isOpen,
  onClose,
  onTransactionCreated,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-2xl w-full max-w-lg p-8 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Transfer Money
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <TransactionForm
          onSuccess={onTransactionCreated}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

export default TransferMoneyModal;