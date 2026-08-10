import { motion } from "framer-motion";
import { Landmark } from "lucide-react";
import Badge from "../ui/Badge";
import { formatCurrency } from "../../utils/formatCurrency";

const STATUS_VARIANT = {
  ACTIVE: "positive",
  FROZEN: "warning",
  CLOSED: "neutral",
};

const TYPE_LABEL = {
  SAVINGS: "Savings",
  CURRENT: "Current",
  CREDIT: "Credit",
  CASH: "Cash",
};

function AccountCard({ account }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="relative overflow-hidden rounded-card-lg border border-line bg-surface p-6 shadow-card transition-colors hover:border-line-strong"
    >
      {/* Subtle geometric backdrop — no fake credit-card skeuomorphism */}
      <svg
        className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 opacity-[0.06]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="99" stroke="white" strokeWidth="1" />
        <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="1" />
        <circle cx="100" cy="100" r="41" stroke="white" strokeWidth="1" />
      </svg>

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">{account.name}</p>
          <p className="mt-1 text-xs text-ink-faint">{TYPE_LABEL[account.type] || account.type} Account</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-surface-3 text-ink-muted">
          <Landmark size={18} />
        </div>
      </div>

      <p className="financial-figure relative mt-6 text-[30px] font-bold text-ink">
        {formatCurrency(account.balance)}
      </p>

      <div className="relative mt-6 flex items-center justify-between border-t border-line pt-4">
        <span className="font-mono text-sm tracking-widest text-ink-faint">
          •••• {account._id.slice(-4)}
        </span>
        <Badge variant={STATUS_VARIANT[account.status] || "neutral"} dot>
          {account.status}
        </Badge>
      </div>
    </motion.div>
  );
}

export default AccountCard;
