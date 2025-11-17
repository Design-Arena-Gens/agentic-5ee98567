"use client";

import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp, Wallet2, Wand2 } from "lucide-react";
import { SpendingChart } from "@/components/SpendingChart";
import { SummaryCards } from "@/components/SummaryCards";
import { ExpenseTable } from "@/components/ExpenseTable";
import { BudgetPlanner } from "@/components/BudgetPlanner";
import { ActivityFeed } from "@/components/ActivityFeed";

export type ExpenseCategory =
  | "Housing"
  | "Transportation"
  | "Food"
  | "Entertainment"
  | "Utilities"
  | "Shopping"
  | "Healthcare"
  | "Other";

export interface Expense {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  method: "Card" | "Cash" | "Transfer";
  recurring?: boolean;
}

const defaultBudgets: Record<ExpenseCategory, number> = {
  Housing: 1500,
  Transportation: 400,
  Food: 600,
  Entertainment: 350,
  Utilities: 280,
  Shopping: 500,
  Healthcare: 250,
  Other: 200,
};

const initialExpenses: Expense[] = [
  {
    id: "1",
    name: "Apartment Rent",
    category: "Housing",
    amount: 1325,
    date: "2024-06-02",
    method: "Transfer",
    recurring: true,
  },
  {
    id: "2",
    name: "Weekly Groceries",
    category: "Food",
    amount: 124.78,
    date: "2024-06-08",
    method: "Card",
  },
  {
    id: "3",
    name: "Gym Membership",
    category: "Healthcare",
    amount: 49.99,
    date: "2024-06-01",
    method: "Card",
    recurring: true,
  },
  {
    id: "4",
    name: "Streaming Services",
    category: "Entertainment",
    amount: 39.97,
    date: "2024-06-03",
    method: "Card",
    recurring: true,
  },
  {
    id: "5",
    name: "Coffee with Friends",
    category: "Entertainment",
    amount: 22.4,
    date: "2024-06-09",
    method: "Cash",
  },
  {
    id: "6",
    name: "Fuel",
    category: "Transportation",
    amount: 68.12,
    date: "2024-06-11",
    method: "Card",
  },
  {
    id: "7",
    name: "Electric Bill",
    category: "Utilities",
    amount: 143.6,
    date: "2024-06-05",
    method: "Transfer",
    recurring: true,
  },
  {
    id: "8",
    name: "Pharmacy Visit",
    category: "Healthcare",
    amount: 32.54,
    date: "2024-06-12",
    method: "Card",
  },
  {
    id: "9",
    name: "New Headphones",
    category: "Shopping",
    amount: 129.99,
    date: "2024-06-07",
    method: "Card",
  },
  {
    id: "10",
    name: "Weekend Brunch",
    category: "Food",
    amount: 58.25,
    date: "2024-06-09",
    method: "Card",
  },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Home() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [budgets, setBudgets] = useState(defaultBudgets);
  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategory | "All">("All");
  const [selectedMonth, setSelectedMonth] = useState("June");

  const monthlyExpenses = useMemo(
    () =>
      expenses.filter((expense) => {
        const expenseMonth = months[new Date(expense.date).getMonth()];
        return selectedMonth === expenseMonth;
      }),
    [expenses, selectedMonth],
  );

  const totals = useMemo(() => {
    const spent = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
    const recurring = monthlyExpenses
      .filter((item) => item.recurring)
      .reduce((sum, item) => sum + item.amount, 0);
    const remainingBudget = Object.entries(budgets).reduce(
      (sum, [key, value]) => {
        const categorySpent = monthlyExpenses
          .filter((item) => item.category === key)
          .reduce((categorySum, item) => categorySum + item.amount, 0);

        return sum + Math.max(value - categorySpent, 0);
      },
      0,
    );

    return {
      spent,
      recurring,
      remainingBudget,
    };
  }, [monthlyExpenses, budgets]);

  const filteredExpenses = useMemo(() => {
    return monthlyExpenses.filter((expense) => {
      const matchesCategory =
        selectedCategory === "All" || expense.category === selectedCategory;
      return matchesCategory;
    });
  }, [monthlyExpenses, selectedCategory]);

  const handleExpenseAdd = (expense: Omit<Expense, "id">) => {
    setExpenses((prev) => [
      { ...expense, id: crypto.randomUUID() },
      ...prev,
    ]);
  };

  const handleExpenseRemove = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu blur-[120px]">
          <div className="mx-auto h-72 w-full max-w-2xl rounded-full bg-emerald-500/40 opacity-30"></div>
        </div>
        <header className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-20 pt-16 md:pt-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
                Control your cashflow
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-white md:text-5xl">
                Smart Expense Management for High-Performing Teams
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
                Organize every payment, project future spend, and keep your budget on track with live analytics, scenario planning, and collaborative workflows.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                  <Wallet2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-emerald-200">Auto-saves every transaction</p>
                  <p className="text-lg font-semibold text-white">$8.4M tracked</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <TrendingUp className="h-5 w-5 text-emerald-300" />
                <span>Forecast coverage for the next 180 days</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <TrendingDown className="h-5 w-5 text-emerald-300" />
                <span>Smart alerts before budget overruns</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Wand2 className="h-5 w-5 text-emerald-300" />
                <span>AI insights on every ledger entry</span>
              </div>
            </div>
          </div>

          <SummaryCards
            totals={totals}
            expenses={monthlyExpenses}
            budgets={budgets}
            selectedMonth={selectedMonth}
          />
        </header>
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-24">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <SpendingChart
            expenses={filteredExpenses}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            months={months}
          />
          <ActivityFeed expenses={filteredExpenses} />
        </section>

        <section className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <ExpenseTable
            expenses={filteredExpenses}
            onAddExpense={handleExpenseAdd}
            onRemove={handleExpenseRemove}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <BudgetPlanner
            expenses={monthlyExpenses}
            budgets={budgets}
            onBudgetChange={(category, value) =>
              setBudgets((prev) => ({ ...prev, [category]: value }))
            }
          />
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/40 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Ledgerly. Built for finance teams that move fast.</p>
          <div className="flex gap-6">
            <a href="#overview" className="transition hover:text-white">
              Platform
            </a>
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
