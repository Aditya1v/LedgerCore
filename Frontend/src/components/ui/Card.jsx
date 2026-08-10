import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/**
 * Base surface used throughout the app. `interactive` adds a hover lift for
 * cards that act like affordances (clickable rows, nav items).
 */
function Card({
  children,
  className = "",
  interactive = false,
  padding = "p-6",
  as: Component = motion.div,
  ...props
}) {
  return (
    <Component
      {...(interactive
        ? { whileHover: { y: -2 }, transition: { duration: 0.18, ease: "easeOut" } }
        : {})}
      className={cn(
        "rounded-card border border-line bg-surface shadow-card",
        padding,
        interactive && "cursor-pointer transition-colors hover:border-line-strong hover:bg-surface-hover",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;
