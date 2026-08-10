import Modal from "../ui/Modal";
import TransactionForm from "../forms/TransactionForm";

function TransferMoneyModal({ isOpen, onClose, onTransactionCreated }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Money"
      description="Move money between your accounts securely."
      size="md"
    >
      <TransactionForm onSuccess={onTransactionCreated} onClose={onClose} />
    </Modal>
  );
}

export default TransferMoneyModal;
