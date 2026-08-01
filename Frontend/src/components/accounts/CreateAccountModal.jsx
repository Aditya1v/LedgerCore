
import { useState } from "react";
import AccountForm from "../forms/AccountForm";
import { createAccount } from "../../services/accountService";

function CreateAccountModal({ isOpen, onClose,onAccountCreated, }) {
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-slate-900 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white">Create Account</h2>

        <p className="text-slate-400 mt-2">Create a new bank account.</p>

        <div className="mt-8">
          <AccountForm onSubmit={handleCreateAccount} loading={loading} />
        </div>

        <button onClick={onClose} className="mt-8 text-red-400">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CreateAccountModal;
