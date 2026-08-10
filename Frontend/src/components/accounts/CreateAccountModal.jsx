import { useState } from "react";
import Modal from "../ui/Modal";
import AccountForm from "../forms/AccountForm";
import { createAccount } from "../../services/accountService";

function CreateAccountModal({ isOpen, onClose, onAccountCreated }) {
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async (data) => {
    try {
      setLoading(true);
      await createAccount(data);
      await onAccountCreated();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Account"
      description="Add a new account to your ledger."
      size="sm"
    >
      <AccountForm onSubmit={handleCreateAccount} loading={loading} />
    </Modal>
  );
}

export default CreateAccountModal;
