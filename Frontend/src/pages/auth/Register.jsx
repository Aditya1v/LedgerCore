import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

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
      <h1 className="text-5xl font-bold text-white">Create Account</h1>

      <p className="mt-4 mb-8 text-slate-400">
        Start managing your finances securely.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          error={errors.name?.message}
          {...register("name")}
        />
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
          placeholder="Create a password"
          error={errors.password?.message}
          {...register("password")}
        />
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Register;
