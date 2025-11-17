import { FormEvent, useMemo, useState } from "react";
import { Expense, ExpenseCategory } from "@/app/page";
import { Plus, Trash2 } from "lucide-react";

interface ExpenseTableProps {
  expenses: Expense[];
  selectedCategory: ExpenseCategory | "All";
  onCategoryChange: (category: ExpenseCategory | "All") => void;
  onAddExpense: (expense: Omit<Expense, "id">) => void;
  onRemove: (id: string) => void;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const categories: (ExpenseCategory | "All")[] = [
  "All",
  "Housing",
  "Transportation",
  "Food",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Healthcare",
  "Other",
];

const defaultForm = {
  name: "",
  category: "Food" as ExpenseCategory,
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  method: "Card" as Expense["method"],
  recurring: false,
};

export function ExpenseTable({
  expenses,
  selectedCategory,
  onCategoryChange,
  onAddExpense,
  onRemove,
}: ExpenseTableProps) {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");

  const total = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.amount) {
      setError("Name and amount are required");
      return;
    }

    const amountNumber = Number.parseFloat(form.amount);
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      setError("Enter a valid amount");
      return;
    }

    onAddExpense({
      name: form.name,
      amount: amountNumber,
      category: form.category,
      date: form.date,
      method: form.method,
      recurring: form.recurring,
    });

    setForm({ ...defaultForm, date: form.date });
    setError("");
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6" aria-label="Expense ledger">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-300">Expense ledger</p>
          <h2 className="text-xl font-semibold text-white">
            {formatter.format(total)} this month
          </h2>
        </div>
        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value as ExpenseCategory | "All")}
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white sm:w-auto"
        >
          {categories.map((category) => (
            <option key={category} value={category} className="text-slate-900">
              {category}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-6">
        <input
          className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-500"
          placeholder="Expense name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />
        <select
          className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white"
          value={form.category}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, category: event.target.value as ExpenseCategory }))
          }
        >
          {categories
            .filter((category) => category !== "All")
            .map((category) => (
              <option key={category} value={category} className="text-slate-900">
                {category}
              </option>
            ))}
        </select>
        <input
          className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-500"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
        />
        <input
          className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white"
          type="date"
          value={form.date}
          onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
        />
        <select
          className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white"
          value={form.method}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, method: event.target.value as Expense["method"] }))
          }
        >
          {(["Card", "Cash", "Transfer"] as Expense["method"][]).map((method) => (
            <option key={method} value={method} className="text-slate-900">
              {method}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
        {error && <p className="md:col-span-6 text-sm text-rose-300">{error}</p>}
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/5">
        <div className="max-h-80 overflow-y-auto">
          <table className="min-w-full divide-y divide-white/5 text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Method</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/20 text-white">
              {expenses.map((expense) => (
                <tr key={expense.id} className="transition hover:bg-white/5">
                  <td className="px-4 py-3 font-medium">{expense.name}</td>
                  <td className="px-4 py-3 text-slate-300">{expense.category}</td>
                  <td className="px-4 py-3 text-right text-emerald-200">
                    {formatter.format(expense.amount)}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {new Date(expense.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{expense.method}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onRemove(expense.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-rose-200 hover:border-rose-400 hover:text-rose-200"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No expenses match your filters yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
