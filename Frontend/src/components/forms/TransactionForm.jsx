import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

import { getAccounts } from "../../services/accountService";
import { createTransaction } from "../../services/transactionService";

import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

import {
  convertToBase,
  formatCurrency,
  getCurrencySymbol,
  getSelectedCurrency,
} from "../../utils/formatCurrency";

function TransactionForm({ onSuccess, onClose }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const currency = getSelectedCurrency();
  const currencySymbol = getCurrencySymbol(currency);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      category: "Transfer",
    },
  });

  const fromAccount = watch("fromAccount");
  const toAccount = watch("toAccount");
  const amount = watch("amount");

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

  const selectedFromAccount = accounts.find(
    (account) =>
      account._id === fromAccount
  );

  const onSubmit = async (data) => {
    try {
      if (fromAccount === data.toAccount) {
        toast.error(
          "Sender and receiver account cannot be the same."
        );

        return;
      }

      setLoading(true);

      /*
       * User enters the amount in the selected currency.
       *
       * Example:
       *
       * Selected currency = USD
       * User enters = $100
       *
       * Backend receives the INR equivalent.
       */
      const displayAmount = Number(data.amount);

      const baseAmount = convertToBase(
        displayAmount,
        currency
      );

      await createTransaction({
        ...data,

        amount: Number(
          baseAmount.toFixed(2)
        ),

        tags: [],
        merchant: "",
        description: data.description || "",
        idempotencyKey: uuidv4(),
      });

      reset();

      toast.success(
        "Money transferred successfully"
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Transaction failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const showSummary =
    fromAccount &&
    toAccount &&
    amount > 0;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <Select
        label="From Account"
        error={
          errors.fromAccount &&
          "Select a sender account"
        }
        {...register("fromAccount", {
          required: true,
        })}
      >
        <option value="">
          Select account
        </option>

        {accounts.map((account) => (
          <option
            key={account._id}
            value={account._id}
          >
            {account.name} · {account.type} ·{" "}
            {formatCurrency(account.balance)}
          </option>
        ))}
      </Select>

      <Input
        label="To Account"
        placeholder="Paste receiver account ID"
        error={
          errors.toAccount &&
          "Receiver account ID is required"
        }
        {...register("toAccount", {
          required: true,
        })}
      />

      <Input
        label={`Amount (${currency})`}
        type="number"
        step="0.01"
        prefix={currencySymbol}
        placeholder="0.00"
        error={
          errors.amount &&
          "Enter a valid amount"
        }
        {...register("amount", {
          required: true,
          min: 0.01,
        })}
      />

      <Input
        label="Category"
        error={
          errors.category &&
          "Category is required"
        }
        {...register("category", {
          required: true,
        })}
      />

      <Input
        label="Description"
        hint="Optional"
        placeholder="What's this transfer for?"
        {...register("description")}
      />

      {showSummary && (
        <div className="rounded-card border border-line bg-surface-2 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Transfer Summary
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="min-w-0 truncate text-sm text-ink-muted">
              {selectedFromAccount?.name ||
                "Your account"}
            </span>

            <ArrowRight
              size={15}
              className="shrink-0 text-ink-faint"
            />

            <span className="min-w-0 truncate text-sm text-ink-muted">
              Recipient
            </span>
          </div>

          <p className="financial-figure mt-3 text-xl font-bold text-ink">
            {formatCurrency(
              convertToBase(
                Number(amount) || 0,
                currency
              ),
              currency
            )}
          </p>
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        fullWidth
        size="lg"
      >
        {loading
          ? "Sending..."
          : "Transfer Money"}
      </Button>
    </form>
  );
}

export default TransactionForm;