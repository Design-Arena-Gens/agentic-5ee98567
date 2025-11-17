import { Expense } from "@/app/page";
import { CalendarRange, CreditCard, RefreshCcw } from "lucide-react";

interface ActivityFeedProps {
  expenses: Expense[];
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function ActivityFeed({ expenses }: ActivityFeedProps) {
  const upcoming = expenses.filter((expense) => expense.recurring);
  const recent = expenses.slice(0, 6);

  return (
    <aside className="flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div>
        <div className="flex items-center gap-3 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-100">
            <CalendarRange className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-slate-300">Recurrence radar</p>
            <h3 className="text-lg font-semibold text-white">Upcoming debits</h3>
          </div>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          {upcoming.length === 0 && <li>No recurring expenses this month.</li>}
          {upcoming.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <div>
                <p className="font-medium text-white">{expense.name}</p>
                <p className="text-xs text-slate-400">{expense.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-emerald-200">
                  {formatter.format(expense.amount)}
                </p>
                <p className="text-xs text-slate-400">via {expense.method}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        <div className="flex items-center gap-3 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-100">
            <CreditCard className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-slate-300">Latest activity</p>
            <h3 className="text-lg font-semibold text-white">6 newest entries</h3>
          </div>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          {recent.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center justify-between border-b border-white/5 pb-2"
            >
              <div>
                <p className="font-medium text-white">{expense.name}</p>
                <p className="text-xs text-slate-500">
                  {new Date(expense.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p>{formatter.format(expense.amount)}</p>
                <p className="text-xs text-slate-500">{expense.category}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-transparent to-indigo-500/10 px-5 py-4 text-sm text-slate-300">
          <div>
            <p className="font-medium text-white">Automate reviews</p>
            <p className="text-xs text-slate-400">
              Let Ledgerly reconcile high-volume vendors every Friday.
            </p>
          </div>
          <RefreshCcw className="h-5 w-5 text-emerald-200" />
        </div>
      </div>
    </aside>
  );
}
