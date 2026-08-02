import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import Card from "../ui/Card";
import { formatCurrency } from "../../utils/formatCurrency";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-xl">
      <p className="mb-2 font-semibold text-white">{label}</p>

      <p className="text-green-400">
        Income: {formatCurrency(payload[0].value)}
      </p>

      <p className="text-red-400">
        Expense: {formatCurrency(payload[1].value)}
      </p>
    </div>
  );
}

function CashFlowChart({ data }) {
  const chartData = data;

  return (
    <Card>
      <h2 className="mb-6 text-xl font-semibold text-slate-100">
        Monthly Cash Flow
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            dataKey="month"
            stroke="#94a3b8"
          />

          <YAxis
            stroke="#94a3b8"
            tickFormatter={(value) => `₹${value / 1000}k`}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default CashFlowChart;