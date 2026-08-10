import { PieChart as PieChartIcon } from "lucide-react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";

const BAR_COLORS = ["#5468ff", "#2fd180", "#f3b94d", "#f1594f", "#8b7cf6", "#38bdf8"];

function CategorySpendingChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <h2 className="text-[17px] font-semibold text-ink">Category-wise Spending</h2>
        <div className="mt-6">
          <EmptyState
            icon={PieChartIcon}
            title="No spending data"
            description="Spending by category will appear here once you have transactions."
          />
        </div>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-ink">Category-wise Spending</h2>
        <span className="financial-figure text-sm text-ink-faint">Total {formatCurrency(total)}</span>
      </div>

      <div className="mt-7 space-y-6">
        {data.map((item, index) => {
          const percentage = total === 0 ? 0 : (item.amount / total) * 100;

          return (
            <div key={item.category}>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-[14.5px] font-medium text-ink">{item.category}</p>
                  <p className="text-xs text-ink-faint">{percentage.toFixed(1)}%</p>
                </div>
                <p className="financial-figure text-[14.5px] font-semibold text-ink">
                  {formatCurrency(item.amount)}
                </p>
              </div>

              <div className="h-2 overflow-hidden rounded-pill bg-surface-3">
                <div
                  className="h-full rounded-pill transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default CategorySpendingChart;
