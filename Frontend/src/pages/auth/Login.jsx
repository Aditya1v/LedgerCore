import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { loginSchema } from "../../validations/authSchema";
import { loginUser, demoLogin } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const response = await loginUser(data);
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setServerError("");
    setLoading(true);

    try {
      const response = await demoLogin();
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      setServerError(error.response?.data?.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-[26px] font-bold text-ink">Welcome back</h1>
      <p className="mt-2 text-[15px] text-ink-faint">Sign in to continue to LedgerCore.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
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
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />

        {serverError && (
          <p className="rounded-control border border-negative-line bg-negative-soft px-3.5 py-2.5 text-sm text-negative">
            {serverError}
          </p>
        )}

        <Button type="submit" loading={loading} fullWidth size="lg">
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          icon={Sparkles}
          onClick={handleDemoLogin}
          disabled={loading}
          fullWidth
          size="lg"
        >
          Try Demo Account
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-ink-faint">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-accent-hover transition-colors hover:text-accent">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
