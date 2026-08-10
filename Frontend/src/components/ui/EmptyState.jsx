import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

function EmptyState({ title, description, action, icon: Icon = Inbox }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center justify-center rounded-card border border-dashed border-line-strong bg-surface/60 px-8 py-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-ink-faint">
        <Icon size={24} strokeWidth={1.75} />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-ink">{title}</h2>

      <p className="mt-2 max-w-sm text-sm text-ink-faint">{description}</p>

      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}

export default EmptyState;
