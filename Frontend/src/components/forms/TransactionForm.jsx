import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

import { getAccounts } from "../../services/accountService";
import { createTransaction } from "../../services/transactionService";

function TransactionForm({ onSuccess, onClose }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const fromAccount = watch("fromAccount");

  useEffect(() => {
    async function loadAccounts() {
      try {
        const response = await getAccounts();
        setAccounts(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadAccounts();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (fromAccount === data.toAccount) {
        toast.error("Sender and receiver account cannot be the same.");
        return;
      }
      setLoading(true);

      await createTransaction({
        ...data,
        amount: Number(data.amount),
        tags: [],
        merchant: "",
        description: "",
        idempotencyKey: uuidv4(),
      });

      reset();

      toast.success("Money transferred successfully");
      onSuccess();

      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm mb-2 text-slate-300">
          From Account
        </label>

        <select
          {...register("fromAccount", { required: true })}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
        >
          <option value="">Select Account</option>

          {accounts.map((account) => (
            <option key={account._id} value={account._id}>
              {account.name} • {account.type} • ₹
              {account.balance.toLocaleString()}
            </option>
          ))}
        </select>

        {errors.fromAccount && (
          <p className="text-red-500 text-sm mt-1">Select sender account</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-2 text-slate-300">
          Receiver Account ID
        </label>

        <input
          type="text"
          placeholder="Paste receiver account ID"
          {...register("toAccount", { required: true })}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
        />

        {errors.toAccount && (
          <p className="text-red-500 text-sm mt-1">
            Receiver Account ID is required
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-2 text-slate-300">Amount</label>

        <input
          type="number"
          {...register("amount", { required: true })}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
        />

        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">Amount required</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-2 text-slate-300">Category</label>

        <input
          {...register("category", { required: true })}
          defaultValue="Transfer"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
        />

        {errors.category && (
          <p className="text-red-500 text-sm mt-1">Category required</p>
        )}
      </div>

      <button
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-semibold text-white"
      >
        {loading ? "Sending..." : "Transfer Money"}
      </button>
    </form>
  );
}

export default TransactionForm;
