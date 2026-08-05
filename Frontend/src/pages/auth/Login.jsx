import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";


import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { loginSchema } from "../../validations/authSchema";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

function Login() {

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Runs when the form is submitted successfully
  const onSubmit = async (data) => {


    setServerError("");
    setLoading(true);
    try {
      const response = await loginUser(data);


      setUser(response.data.user);


      navigate("/dashboard"); //we use navigate after user , it prevent before rendring of dashboard page.

      // console.log("User:", response.user);
      // console.log("Token:", response.token);
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-5xl font-bold text-white">Welcome back</h1>

      <p className="mt-4 mb-8 text-slate-400">Sign in to continue.</p>

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
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Login;
