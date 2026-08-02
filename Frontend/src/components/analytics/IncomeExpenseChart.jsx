import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import Card from "../ui/Card";
import { formatCurrency } from "../../utils/formatCurrency";

const COLORS = ["#22c55e", "#ef4444"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-xl">
      <p className="text-white font-semibold">
        {payload[0].name}
      </p>

      <p className="text-slate-300">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

function IncomeExpenseChart({ income, expense }) {
  const data = [
    {
      name: "Income",
      value: income,
    },
    {
      name: "Expense",
      value: expense,
    },
  ];

  const net = income - expense;

  return (
    <Card>
      <h2 className="mb-6 text-xl font-semibold text-slate-100">
        Income vs Expense
      </h2>

      <div className="relative h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={75}
              outerRadius={110}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm text-slate-400">
            Net Savings
          </p>

          <p className="text-2xl font-bold text-white">
            {formatCurrency(net)}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-300">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
            Income
          </span>

          <span className="text-green-400">
            {formatCurrency(income)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-300">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            Expense
          </span>

          <span className="text-red-400">
            {formatCurrency(expense)}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default IncomeExpenseChart;