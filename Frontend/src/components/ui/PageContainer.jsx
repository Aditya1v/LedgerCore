import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/**
 * Wraps page content with a consistent max width and a subtle fade/slide-in
 * entrance so navigating between routes feels intentional without a heavy
 * router-level transition system.
 */
function PageContainer({ children, className = "", wide = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn("mx-auto w-full space-y-8", wide ? "max-w-7xl" : "max-w-6xl", className)}
    >
      {children}
    </motion.div>
  );
}

export default PageContainer;
