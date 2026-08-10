import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Styled wrapper around a native <select>. Kept native (rather than a
 * headless listbox) to avoid adding a new dependency, while still matching
 * the app's visual language.
 */
const Select = forwardRef(function Select(
  { label, name, error, hint, className = "", children, ...props },
  ref
) {
  const autoId = useId();
  const id = name || autoId;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={id}
          name={name}
          {...props}
          className={cn(
            "h-11 w-full appearance-none rounded-control border bg-surface-2 pl-3.5 pr-10 text-[14.5px] text-ink outline-none",
            "transition-colors duration-150",
            "focus:border-accent focus:ring-4 focus:ring-accent-soft",
            error ? "border-negative/60" : "border-line-strong"
          )}
        >
          {children}
        </select>

        <ChevronDown
          size={16}
          strokeWidth={2}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-[13px] text-negative">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[13px] text-ink-faint">{hint}</p>
      ) : null}
    </div>
  );
});

export default Select;
