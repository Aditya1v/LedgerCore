import AuthLayout from "../../layouts/AuthLayout";

function Register() {
  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold text-white">
        Create Account
      </h1>

      <p className="mt-2 text-slate-400">
        Start managing your finances securely.
      </p>
    </AuthLayout>
  );
}

export default Register;