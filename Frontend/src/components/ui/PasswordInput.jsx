import { useId } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

function PasswordInput({ label, name, value, show, setShow, onChange, error }) {
  const autoId = useId();
  const id = name || autoId;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink-muted">
        {label}
      </label>

      <div className="relative">
        <Lock
          size={17}
          strokeWidth={2}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
        />

        <input
          id={id}
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="h-11 w-full rounded-control border border-line-strong bg-surface-2 pl-10 pr-11 text-[14.5px] text-ink outline-none transition-colors duration-150 placeholder:text-ink-faint focus:border-accent focus:ring-4 focus:ring-accent-soft"
        />

        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink-muted"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>

      {error && <p className="mt-1.5 text-[13px] text-negative">{error}</p>}
    </div>
  );
}

export default PasswordInput;
