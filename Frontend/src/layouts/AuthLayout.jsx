import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Landmark, ShieldCheck, Activity, Layers } from "lucide-react";

const HIGHLIGHTS = [
  { icon: ShieldCheck, text: "Bank-grade authentication on every session" },
  { icon: Activity, text: "Real-time ledger with immutable transaction history" },
  { icon: Layers, text: "Unlimited accounts, one unified balance view" },
];

function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-elevated lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      {/* Abstract geometric backdrop — subtle, financial-grid feel */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.5]"
        viewBox="0 0 600 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5468ff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#5468ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="600" height="800" fill="url(#fade)" />
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={i * 90} x2="600" y2={i * 90} stroke="#ffffff" strokeOpacity="0.04" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 90} y1="0" x2={i * 90} y2="800" stroke="#ffffff" strokeOpacity="0.04" />
        ))}
        <circle cx="480" cy="150" r="150" stroke="#5468ff" strokeOpacity="0.25" strokeWidth="1" />
        <circle cx="480" cy="150" r="90" stroke="#5468ff" strokeOpacity="0.3" strokeWidth="1" />
        <path
          d="M40 620 L140 560 L230 600 L330 480 L430 520 L560 400"
          stroke="#2fd180"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      <Link to="/dashboard" className="relative z-10 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-white">
          <Landmark size={18} strokeWidth={2.25} />
        </div>
        <span className="font-display text-lg font-bold text-ink">LedgerCore</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md"
      >
        <h2 className="font-display text-[34px] font-bold leading-[1.15] text-ink xl:text-[38px]">
          Every account, every transaction, one clear ledger.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-faint">
          LedgerCore gives you a single, trustworthy view of your money — balances, transfers, and
          spending, all reconciled in real time.
        </p>

        <ul className="mt-9 space-y-4">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-ink-muted">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-surface border border-line">
                <Icon size={15} className="text-accent-hover" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </motion.div>

      <p className="relative z-10 text-xs text-ink-faint">© {new Date().getFullYear()} LedgerCore. All rights reserved.</p>
    </div>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <BrandPanel />

      <div className="flex flex-1 flex-col items-center justify-center px-5 py-12 sm:px-8">
        <Link to="/dashboard" className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-white">
            <Landmark size={18} strokeWidth={2.25} />
          </div>
          <span className="font-display text-lg font-bold text-ink">LedgerCore</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px] rounded-modal border border-line bg-surface p-8 shadow-card sm:p-9"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export default AuthLayout;
