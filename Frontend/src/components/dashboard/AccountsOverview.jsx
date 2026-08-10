import { Link } from "react-router-dom";
import { ArrowRight, Landmark, Plus } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { Skeleton } from "../ui/Loader";
import { formatCurrency } from "../../utils/formatCurrency";

const STATUS_VARIANT = {
  ACTIVE: "positive",
  FROZEN: "warning",
  CLOSED: "neutral",
};

/**
 * Compact "Accounts" panel for the dashboard. Fetches from the same
 * getAccounts() service the Accounts page already uses, so it's real data
 * — just trimmed to a short preview with a link to the full page.
 */
function AccountsOverview({ accounts, loading }) {
  const preview = (accounts || []).slice(0, 3);

  return (
    <Card padding="p-0">
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <h2 className="text-[17px] font-semibold text-ink">Accounts</h2>
        <Link
          to="/accounts"
          className="flex items-center gap-1 text-sm font-medium text-accent-hover transition-colors hover:text-accent"
        >
          Manage
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-1 p-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
        ) : preview.length === 0 ? (
          <Link
            to="/accounts"
            className="flex flex-col items-center gap-2 rounded-control border border-dashed border-line-strong px-4 py-8 text-center transition-colors hover:border-accent-line hover:bg-surface-2"
          >
            <Plus size={18} className="text-ink-faint" />
            <p className="text-sm text-ink-faint">Create your first account</p>
          </Link>
        ) : (
          preview.map((account) => (
            <Link
              key={account._id}
              to="/accounts"
              className="flex items-center justify-between gap-3 rounded-control px-3 py-3 transition-colors hover:bg-surface-hover"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-surface-3 text-ink-muted">
                  <Landmark size={16} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium text-ink">{account.name}</p>
                  <p className="text-xs text-ink-faint">
                    •••• {account._id.slice(-4)}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="financial-figure text-[14px] font-semibold text-ink">
                  {formatCurrency(account.balance)}
                </p>
                <Badge variant={STATUS_VARIANT[account.status] || "neutral"} className="mt-1">
                  {account.status}
                </Badge>
              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}

export default AccountsOverview;
