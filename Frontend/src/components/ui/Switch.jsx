import { cn } from "../../utils/cn";

/**
 * Accessible toggle switch backed by a real checkbox input so it works with
 * keyboard navigation and screen readers without extra ARIA plumbing.
 */
function Switch({ checked, onChange, label, description, id, disabled = false }) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start justify-between gap-4",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {(label || description) && (
        <span className="flex flex-col">
          {label && <span className="text-[14.5px] font-medium text-ink">{label}</span>}
          {description && <span className="mt-0.5 text-sm text-ink-faint">{description}</span>}
        </span>
      )}

      <span className="relative inline-flex shrink-0 items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
        />
        <span
          className={cn(
            "h-6 w-11 rounded-pill bg-surface-3 border border-line-strong transition-colors duration-200",
            "peer-checked:bg-accent peer-checked:border-accent",
            "peer-focus-visible:ring-4 peer-focus-visible:ring-accent-soft"
          )}
        />
        <span
          className={cn(
            "absolute left-1 top-1 h-4 w-4 rounded-full bg-ink-muted transition-all duration-200",
            "peer-checked:translate-x-5 peer-checked:bg-white"
          )}
        />
      </span>
    </label>
  );
}

export default Switch;
