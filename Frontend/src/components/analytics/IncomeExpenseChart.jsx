import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import Card from "../ui/Card";

const COLORS = ["#22c55e", "#ef4444"];

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

  return (
    <Card>
      <h2 className="mb-6 text-xl font-semibold text-slate-100">
        Income vs Expense
      </h2>

      <ResponsiveContainer width="100%" height={320}>
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

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default IncomeExpenseChart;