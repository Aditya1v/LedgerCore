function Input({ label, type = "text", placeholder, name, error, ...props }) {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        {...props}
        className={`
          w-full
          rounded-xl
          border
          ${
            error
            ? "border-red-500"
            : "border-slate-700 focus:border-blue-600"
          }
          border-slate-700
          bg-slate-800
          px-4
          py-3
          text-white
          placeholder:text-slate-500
          outline-none
          transition
          focus:border-blue-600
          focus:ring-2
        focus:ring-blue-600/20
        `}
      />
      {error && (
        <p className="mt-2 text-sm text-red-400">
         {error}
        </p>
      )}
    </div>
  );
}

export default Input;
