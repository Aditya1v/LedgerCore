import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import Card from "../ui/Card";
import { formatCurrency } from "../../utils/formatCurrency";

const COLORS = ["#2fd180", "#f1594f"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-control border border-line-strong bg-surface px-4 py-3 shadow-modal">
      <p className="text-sm font-semibold text-ink">{payload[0].name}</p>
      <p className="financial-figure mt-0.5 text-sm text-ink-muted">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

function IncomeExpenseChart({ income, expense }) {
  const data = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const net = income - expense;

  return (
    <Card>
      <h2 className="text-[17px] font-semibold text-ink">Income vs Expense</h2>
      <p className="mt-1 text-sm text-ink-faint">Where your cash flow is going.</p>

      <div className="relative mt-6 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={78} outerRadius={104} paddingAngle={3} dataKey="value" stroke="none">
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Net Savings</p>
          <p className="financial-figure mt-1 text-2xl font-bold text-ink">{formatCurrency(net)}</p>
        </div>
      </div>

      <div className="mt-5 space-y-2.5 border-t border-line pt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-ink-muted">
            <span className="h-2.5 w-2.5 rounded-full bg-positive" />
            Income
          </span>
          <span className="financial-figure font-medium text-positive">{formatCurrency(income)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-ink-muted">
            <span className="h-2.5 w-2.5 rounded-full bg-negative" />
            Expense
          </span>
          <span className="financial-figure font-medium text-negative">{formatCurrency(expense)}</span>
        </div>
      </div>
    </Card>
  );
}

export default IncomeExpenseChart;
