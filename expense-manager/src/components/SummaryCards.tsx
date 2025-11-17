import { Expense, ExpenseCategory } from "@/app/page";
import { ArrowUpRight, PieChart, ShieldCheck, Sparkles } from "lucide-react";

interface SummaryCardsProps {
  totals: {
    spent: number;
    recurring: number;
    remainingBudget: number;
  };
  expenses: Expense[];
  budgets: Record<ExpenseCategory, number>;
  selectedMonth: string;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function SummaryCards({
  totals,
  expenses,
  budgets,
  selectedMonth,
}: SummaryCardsProps) {
  const monthlyTrends = expenses.reduce<Record<ExpenseCategory, number>>(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
      return acc;
    },
    {} as Record<ExpenseCategory, number>,
  );

  const mostActiveCategory = Object.entries(monthlyTrends).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4" id="overview">
      <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-emerald-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300">Total spend ({selectedMonth})</p>
            <h3 className="mt-3 text-3xl font-semibold text-white">
              {formatter.format(totals.spent)}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
            <PieChart className="h-6 w-6" />
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          Up 12% vs last month with strong control over discretionary categories.
        </p>
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300">Recurring commitments</p>
            <h3 className="mt-3 text-3xl font-semibold text-white">
              {formatter.format(totals.recurring)}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          68% of monthly spend is locked. Great candidates for contract renegotiation alerts.
        </p>
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300">Remaining budgets</p>
            <h3 className="mt-3 text-3xl font-semibold text-white">
              {formatter.format(totals.remainingBudget)}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-sky-200">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {Object.entries(budgets)
            .slice(0, 3)
            .map(([category, limit]) => {
              const spent = monthlyTrends[category as ExpenseCategory] ?? 0;
              const progress = Math.min((spent / limit) * 100, 100);

              return (
                <div key={category}>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{category}</span>
                    <span>
                      {Math.round(progress)}% · {formatter.format(limit - spent)} left
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300">Insights spotlight</p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              {mostActiveCategory
                ? `${mostActiveCategory} driving spend`
                : "Balanced usage"}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-200">
            <ArrowUpRight className="h-6 w-6" />
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          Let Ledgerly forecast next month and recommend cost-saving measures automatically.
        </p>
      </article>
    </section>
  );
}
