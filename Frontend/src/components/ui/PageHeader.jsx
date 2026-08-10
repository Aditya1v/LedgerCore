import { motion } from "framer-motion";

/**
 * Consistent page-level heading: title + subtitle on the left, optional
 * action (usually a primary Button) on the right. Used at the top of every
 * dashboard page so the hierarchy reads the same everywhere.
 */
function PageHeader({ title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="font-display text-[28px] font-bold text-ink sm:text-[32px]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-[15px] text-ink-faint">{subtitle}</p>}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}

export default PageHeader;
