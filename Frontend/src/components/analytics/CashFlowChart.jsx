import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
    <div className="rounded-control border border-line-strong bg-surface px-4 py-3 shadow-modal">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="flex items-center gap-2 text-sm text-ink">
        <span className="h-2 w-2 rounded-full bg-positive" />
        Income <span className="financial-figure font-semibold">{formatCurrency(payload[0].value)}</span>
      </p>
      <p className="mt-1 flex items-center gap-2 text-sm text-ink">
        <span className="h-2 w-2 rounded-full bg-negative" />
        Expense <span className="financial-figure font-semibold">{formatCurrency(payload[1].value)}</span>
      </p>
    </div>
  );
}

function CashFlowChart({ data }) {
  return (
    <Card>
      <h2 className="text-[17px] font-semibold text-ink">Monthly Cash Flow</h2>
      <p className="mt-1 text-sm text-ink-faint">Income and expenses across recent months.</p>

      <div className="mt-6 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2fd180" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#2fd180" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f1594f" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#f1594f" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 5" stroke="rgba(255,255,255,0.06)" vertical={false} />

            <XAxis
              dataKey="month"
              stroke="rgba(255,255,255,0.06)"
              tick={{ fill: "#5c6577", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="rgba(255,255,255,0.06)"
              tick={{ fill: "#5c6577", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value / 1000}k`}
              width={52}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.12)" }} />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#2fd180"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="#f1594f"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default CashFlowChart;
