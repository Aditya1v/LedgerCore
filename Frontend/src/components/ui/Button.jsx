function Button({ children, type = "button", variant = "primary", ...props }) {
  const baseClasses =
    "w-full rounded-xl px-4 py-4 font-medium transition duration-200";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",

    secondary:
      "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
