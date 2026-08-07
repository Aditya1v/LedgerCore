import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Card from "../ui/Card";
import { formatCurrency } from "../../utils/formatCurrency";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
      <p className="font-medium text-white">
        {payload[0].name}
      </p>

      <p className="text-slate-300">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

function CategoryChart({ data }) {
  return (
    <Card>

      <h2 className="mb-6 text-xl font-semibold text-white">
        Category-wise Spending
      </h2>

      <div className="h-[320px]">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </Card>
  );
}

export default CategoryChart;