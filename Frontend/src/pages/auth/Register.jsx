import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { registerSchema } from "../../validations/authSchema";
import { registerUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

function Register() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      const response = await registerUser(data);
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-[26px] font-bold text-ink">Create account</h1>
      <p className="mt-2 text-[15px] text-ink-faint">Start managing your finances securely.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input
          label="Name"
          type="text"
          placeholder="Enter your full name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          error={errors.password?.message}
          {...register("password")}
        />

        {serverError && (
          <p className="rounded-control border border-negative-line bg-negative-soft px-3.5 py-2.5 text-sm text-negative">
            {serverError}
          </p>
        )}

        <Button type="submit" loading={loading} fullWidth size="lg">
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-ink-faint">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-accent-hover transition-colors hover:text-accent">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
