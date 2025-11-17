import { ChangeEvent } from "react";
import { Expense, ExpenseCategory } from "@/app/page";
import { GaugeCircle } from "lucide-react";

interface BudgetPlannerProps {
  expenses: Expense[];
  budgets: Record<ExpenseCategory, number>;
  onBudgetChange: (category: ExpenseCategory, value: number) => void;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function BudgetPlanner({
  expenses,
  budgets,
  onBudgetChange,
}: BudgetPlannerProps) {
  const categoryTotals = expenses.reduce<Record<ExpenseCategory, number>>(
    (accumulator, expense) => {
      accumulator[expense.category] =
        (accumulator[expense.category] ?? 0) + expense.amount;
      return accumulator;
    },
    {
      Housing: 0,
      Transportation: 0,
      Food: 0,
      Entertainment: 0,
      Utilities: 0,
      Shopping: 0,
      Healthcare: 0,
      Other: 0,
    },
  );

  const handleSlider = (
    event: ChangeEvent<HTMLInputElement>,
    category: ExpenseCategory,
  ) => {
    onBudgetChange(category, Number.parseInt(event.target.value, 10));
  };

  return (
    <aside className="flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6" id="pricing">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
          <GaugeCircle className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm text-slate-300">Budget intelligence</p>
          <h3 className="text-lg font-semibold text-white">Tune allocations</h3>
        </div>
      </div>

      <ul className="space-y-5 text-sm text-slate-200">
        {(Object.keys(budgets) as ExpenseCategory[]).map((category) => {
          const limit = budgets[category];
          const spent = categoryTotals[category] ?? 0;
          const progress = Math.min((spent / limit) * 100, 100);
          const burnRate = Math.min(progress / 30, 1);

          return (
            <li
              key={category}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex items-center justify-between text-xs uppercase text-slate-400">
                <span>{category}</span>
                <span>{formatter.format(limit)} limit</span>
              </div>
              <div className="mt-2 h-2.5 w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{formatter.format(spent)} spent</span>
                <span>{formatter.format(Math.max(limit - spent, 0))} left</span>
              </div>
              <div className="mt-4">
                <label className="flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-500">
                  Adjust target
                  <span className="font-semibold text-white">
                    {formatter.format(limit)}
                  </span>
                </label>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={50}
                  value={limit}
                  onChange={(event) => handleSlider(event, category)}
                  className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-emerald-400"
                />
              </div>
              <div className="mt-3 text-xs text-slate-400">
                Burn rate {Math.round(burnRate * 100)}% of daily allowance
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-transparent to-indigo-500/10 p-5 text-xs text-slate-300">
        <p className="font-semibold text-white">Automated guardrails</p>
        <p className="mt-2">
          Activate smart limits and let Ledgerly auto-approve vendor expenses
          that stay within policy while flagging anomalies instantly.
        </p>
      </div>
    </aside>
  );
}
