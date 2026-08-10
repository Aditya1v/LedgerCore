import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../ui/Input";
import Select from "../ui/Select";
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

      <Select label="Account Type" error={errors.type?.message} {...register("type")}>
        <option value="">Select account type</option>
        <option value="SAVINGS">Savings</option>
        <option value="CURRENT">Current</option>
      </Select>

      <Button type="submit" loading={loading} fullWidth size="lg">
        {loading ? "Saving..." : "Create Account"}
      </Button>
    </form>
  );
}

export default AccountForm;
