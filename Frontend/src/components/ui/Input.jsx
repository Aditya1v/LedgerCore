import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";

const Input = forwardRef(function Input(
  {
    label,
    type = "text",
    placeholder,
    name,
    error,
    hint,
    icon: Icon,
    prefix,
    className = "",
    ...props
  },
  ref
) {
  const autoId = useId();
  const id = name || autoId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            strokeWidth={2}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
          />
        )}

        {prefix && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-ink-faint">
            {prefix}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          {...props}
          className={cn(
            "h-11 w-full rounded-control border bg-surface-2 text-[14.5px] text-ink outline-none",
            "placeholder:text-ink-faint transition-colors duration-150",
            "focus:border-accent focus:ring-4 focus:ring-accent-soft",
            error ? "border-negative/60" : "border-line-strong",
            Icon || prefix ? "pl-10" : "pl-3.5",
            isPassword ? "pr-11" : "pr-3.5"
          )}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink-muted"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>

      {error ? (
        <p className="mt-1.5 text-[13px] text-negative">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[13px] text-ink-faint">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
