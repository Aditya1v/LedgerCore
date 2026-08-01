import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../ui/Input";
import Button from "../ui/Button";

import { createAccountSchema } from "../../validations/accountSchema";

function AccountForm({ onSubmit, loading = false, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAccountSchema),
    defaultValues,
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Account Name"
        type="text"
        placeholder="e.g. SBI Savings"
        error={errors.name?.message}
        {...register("name")}
      />

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Account Type
        </label>

        <select
          {...register("type")}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Account Type</option>
          <option value="SAVINGS">Savings</option>
          <option value="CURRENT">Current</option>
        </select>

        {errors.type && (
          <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Account"}
      </Button>
    </form>
  );
}

export default AccountForm;
