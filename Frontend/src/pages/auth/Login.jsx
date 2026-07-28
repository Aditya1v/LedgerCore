import { useForm } from "react-hook-form";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/authSchema";

function Login() {
  // Initialize React Hook Form
  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(loginSchema),
});

  // Runs when the form is submitted successfully
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <AuthLayout>
      <h1 className="text-5xl font-bold text-white">
        Welcome back
      </h1>

      <p className="mt-4 mb-8 text-slate-400">
        Sign in to continue.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit">
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Login;