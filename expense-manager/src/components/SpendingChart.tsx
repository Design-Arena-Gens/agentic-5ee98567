import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Expense, ExpenseCategory } from "@/app/page";

interface SpendingChartProps {
  expenses: Expense[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  months: string[];
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const categoryPalette: Record<ExpenseCategory, string> = {
  Housing: "#22d3ee",
  Transportation: "#f97316",
  Food: "#a855f7",
  Entertainment: "#f472b6",
  Utilities: "#38bdf8",
  Shopping: "#34d399",
  Healthcare: "#facc15",
  Other: "#f87171",
};

function buildChartData(expenses: Expense[]) {
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

  const weekTotals = weeks.map((label, index) => {
    const start = index * 7;
    const end = start + 7;
    const totals: Record<string, number> = {};

    expenses.forEach((expense) => {
      const day = new Date(expense.date).getDate();
      if (day > start && day <= end) {
        totals[expense.category] =
          (totals[expense.category] ?? 0) + expense.amount;
      }
    });

    return {
      name: label,
      ...totals,
    };
  });

  return weekTotals;
}

export function SpendingChart({
  expenses,
  selectedMonth,
  onMonthChange,
  months,
}: SpendingChartProps) {
  const data = buildChartData(expenses);
  const categories = Array.from(
    new Set(expenses.map((expense) => expense.category)),
  ) as ExpenseCategory[];

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 px-6 pb-6 pt-5" id="features">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-300">Live spending curve</p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            {selectedMonth} breakdown
          </h2>
        </div>
        <select
          value={selectedMonth}
          onChange={(event) => onMonthChange(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white backdrop-blur sm:w-auto"
        >
          {months.map((month) => (
            <option key={month} value={month} className="text-slate-900">
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 h-80 w-full">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              {categories.map((category) => (
                <linearGradient
                  key={category}
                  id={`color-${category}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={categoryPalette[category]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={categoryPalette[category]} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="name" stroke="#cbd5f5" tickLine={false} axisLine={false} />
            <YAxis
              stroke="#cbd5f5"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatter.format(value as number)}
              width={80}
            />
            <Tooltip
              cursor={{ strokeDasharray: "4 4" }}
              contentStyle={{
                background: "rgba(15,23,42,0.9)",
                borderRadius: "0.75rem",
                border: "1px solid rgba(148,163,184,0.2)",
                color: "white",
                fontSize: "0.875rem",
              }}
              formatter={(value: number, name: string) => [
                formatter.format(value),
                name,
              ]}
            />
            <Legend />
            {categories.map((category) => (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                stroke={categoryPalette[category]}
                strokeWidth={2.5}
                fill={`url(#color-${category})`}
                dot={false}
                isAnimationActive
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
