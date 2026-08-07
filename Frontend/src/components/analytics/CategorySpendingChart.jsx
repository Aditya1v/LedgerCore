import Card from "../ui/Card";
import { formatCurrency } from "../../utils/formatCurrency";

function CategorySpendingChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <h2 className="text-xl font-semibold text-white">
          Category-wise Spending
        </h2>

        <div className="mt-8 flex h-40 items-center justify-center text-slate-400">
          No spending data available.
        </div>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Category-wise Spending
        </h2>

        <span className="text-sm text-slate-400">
          Total {formatCurrency(total)}
        </span>
      </div>

      <div className="mt-8 space-y-6">
        {data.map((item) => {
          const percentage =
            total === 0 ? 0 : (item.amount / total) * 100;

          return (
            <div key={item.category}>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">
                    {item.category}
                  </p>

                  <p className="text-sm text-slate-400">
                    {percentage.toFixed(1)}%
                  </p>
                </div>

                <p className="font-semibold text-white">
                  {formatCurrency(item.amount)}
                </p>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
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