import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const VARIANTS = {
  primary:
    "bg-accent text-white shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset] hover:bg-accent-hover active:bg-accent-active disabled:hover:bg-accent",
  secondary:
    "bg-surface-2 text-ink border border-line-strong hover:bg-surface-3 hover:border-line-strong",
  ghost:
    "bg-transparent text-ink-muted hover:bg-surface-2 hover:text-ink",
  destructive:
    "bg-negative/10 text-negative border border-negative-line hover:bg-negative/20",
  outline:
    "bg-transparent text-ink border border-line-strong hover:bg-surface-2",
};

const SIZES = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-[15px] gap-2",
};

const Button = forwardRef(function Button(
  {
    children,
    type = "button",
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    fullWidth = false,
    icon: Icon,
    className = "",
    ...props
  },
  ref
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-control font-semibold",
        "transition-colors duration-150 ease-out cursor-pointer",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} strokeWidth={2.25} />
      )}
      {children}
    </motion.button>
  );
});

export default Button;
