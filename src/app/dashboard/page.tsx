"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import SpendingChart from "@/components/dashboard/SpendingChart";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import TransactionsTable, { type ExpenseRow } from "@/components/dashboard/TransactionsTable";

// ─── Framer-motion variants ───────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatMoney(amount: number) {
  return Math.abs(amount).toLocaleString(undefined, {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function LogoutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3M10.667 11.333 14 8l-3.333-3.333M14 8H6"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M8 3.333v9.334M3.333 8h9.334"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ label }: { label: string }) {
  const tone = label.toLowerCase();
  const styles =
    tone === "food"          ? "bg-emerald-500/15 text-emerald-400" :
    tone === "bills"         ? "bg-amber-500/15 text-amber-400"     :
    tone === "income"        ? "bg-indigo-500/15 text-indigo-400"   :
    tone === "entertainment" ? "bg-red-500/15 text-red-400"         :
                               "bg-slate-500/15 text-slate-300";
  return (
    <span className={cx("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium", styles)}>
      {label}
    </span>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ tone, title, value, subtitle }: {
  tone: "red" | "indigo" | "violet" | "amber";
  title: string; value: string; subtitle: string;
}) {
  const glow    = tone === "red" ? "bg-red-500" : tone === "indigo" ? "bg-indigo-500" : tone === "violet" ? "bg-violet-500" : "bg-amber-500";
  const iconBg  = tone === "red" ? "bg-red-500/12" : tone === "indigo" ? "bg-indigo-500/12" : tone === "violet" ? "bg-violet-500/12" : "bg-amber-500/12";
  const hoverShadow = tone === "red"
    ? "group-hover:shadow-[0px_8px_32px_0px_rgba(239,68,68,0.18)]"
    : tone === "indigo"
      ? "group-hover:shadow-[0px_8px_32px_0px_rgba(99,102,241,0.18)]"
      : tone === "violet"
        ? "group-hover:shadow-[0px_8px_32px_0px_rgba(139,92,246,0.18)]"
        : "group-hover:shadow-[0px_8px_32px_0px_rgba(245,158,11,0.18)]";

  return (
    <div className={cx(
      "group relative overflow-hidden rounded-2xl border border-[#1e2640] bg-[#141827]",
      "shadow-[0px_4px_20px_0px_rgba(0,0,0,0.3)] transition-all duration-300",
      "hover:scale-[1.02] hover:shadow-xl hover:border-[#2a3460] cursor-default",
      hoverShadow,
    )}>
      <div className={cx("absolute -right-6 -top-6 h-[100px] w-[100px] rounded-full blur-[48px] opacity-[0.07] group-hover:opacity-[0.22] transition-opacity duration-500", glow)} />
      <div className="flex gap-4 p-6">
        <div className={cx("grid h-10 w-10 place-items-center rounded-[14px] transition-transform duration-300 group-hover:scale-110", iconBg)}>
          <div className={cx("h-4 w-4 rounded-full", glow)} />
        </div>
        <div>
          <div className="text-[13px] leading-4 text-slate-600">{title}</div>
          <div className="mt-1 text-[28px] font-bold leading-9 tracking-[-0.5px] text-slate-100 group-hover:text-white transition-colors duration-200">
            {value}
          </div>
          <div className="mt-1 text-xs font-medium leading-[18px] text-slate-600">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function SidebarContent({ onLogout }: { onLogout?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-[#0f1320]">
      <div className="flex h-16 items-center justify-between border-b border-[#1e2640] px-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-indigo-500 to-violet-500">
            <span className="text-sm font-bold text-white">F</span>
          </div>
          <span className="text-base font-semibold tracking-[-0.4px] text-slate-100">Finova</span>
        </div>
        <div className="h-4 w-4 rounded bg-slate-600/30" aria-hidden="true" />
      </div>

      <div className="flex-1 overflow-auto px-3 py-4">
        <div className="px-3 text-xs font-semibold uppercase tracking-[1.2px] text-slate-600">Main</div>
        <nav className="mt-3 space-y-2">
          <Link href="/dashboard"
            className="relative flex h-11 items-center gap-3 rounded-[10px] bg-indigo-500/15 px-4 text-sm font-medium text-indigo-500 shadow-[0px_0px_12px_0px_rgba(99,102,241,0.1)]">
            <span className="h-[18px] w-[18px] rounded bg-indigo-500/30" aria-hidden="true" />
            Dashboard
            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-indigo-500" />
          </Link>
          <button type="button" className="flex h-11 w-full items-center gap-3 rounded-[10px] px-4 text-sm font-medium text-slate-400 hover:bg-white/[0.03] transition-colors duration-150">
            <span className="h-[18px] w-[18px] rounded bg-slate-500/25" aria-hidden="true" />
            <span className="flex-1 text-left">Accounts</span>
            <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[8px] bg-indigo-500/15 px-1 text-xs font-medium text-indigo-500">3</span>
          </button>
          {["Transactions", "Analytics"].map((item) => (
            <button key={item} type="button" className="flex h-11 w-full items-center gap-3 rounded-[10px] px-4 text-sm font-medium text-slate-400 hover:bg-white/[0.03] transition-colors duration-150">
              <span className="h-[18px] w-[18px] rounded bg-slate-500/25" aria-hidden="true" />
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-6 px-3 text-xs font-semibold uppercase tracking-[1.2px] text-slate-600">Finance</div>
        <nav className="mt-3 space-y-2">
          {["Cards","Investments","Budgets","Alerts","Profile","Settings"].map((item) => (
            <button key={item} type="button" className="flex h-11 w-full items-center gap-3 rounded-[10px] px-4 text-sm font-medium text-slate-400 hover:bg-white/[0.03] transition-colors duration-150">
              <span className="h-[18px] w-[18px] rounded bg-slate-500/25" aria-hidden="true" />
              <span className="flex-1 text-left">{item}</span>
              {item === "Investments" && <span className="inline-flex h-[18px] items-center justify-center rounded-[8px] bg-emerald-500/15 px-2 text-xs font-medium text-emerald-500">New</span>}
              {item === "Alerts" && <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">4</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="border-t border-[#1e2640] p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500">
            <span className="text-xs font-bold text-white">AJ</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-slate-100">Arjun Jha</div>
            <div className="text-xs text-slate-600">Pro Plan</div>
          </div>
          <button type="button" onClick={onLogout} aria-label="Log out"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-slate-500 hover:bg-white/[0.05] hover:text-red-400 transition-colors duration-200">
            <LogoutIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileDrawer({ open, onClose, onLogout }: { open: boolean; onClose: () => void; onLogout?: () => void }) {
  return (
    <div className={cx("fixed inset-0 z-50 lg:hidden", open ? "" : "pointer-events-none")}>
      <div className={cx("absolute inset-0 bg-black/60 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={onClose} />
      <div className={cx("absolute inset-y-0 left-0 w-[280px] transform transition-transform", open ? "translate-x-0" : "-translate-x-full")}>
        <SidebarContent onLogout={onLogout} />
      </div>
    </div>
  );
}

// ─── Fallback data ────────────────────────────────────────────────────────────
const fallbackExpenses: ExpenseRow[] = [
  { id: "grocery", note: "Grocery Store",  category: "Food",          created_at: "2026-03-05T00:00:00.000Z", amount: 82.5  },
  { id: "netflix", note: "Netflix",         category: "Entertainment", created_at: "2026-03-04T00:00:00.000Z", amount: 15.99 },
  { id: "electric",note: "Electric Bill",   category: "Bills",         created_at: "2026-02-28T00:00:00.000Z", amount: 124   },
  { id: "coffee",  note: "Coffee Shop",     category: "Food",          created_at: "2026-02-27T00:00:00.000Z", amount: 6.5   },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);

  const [expenseOpen,      setExpenseOpen]      = useState(false);
  const [expenseSubmitting,setExpenseSubmitting] = useState(false);
  const [expenseMessage,   setExpenseMessage]    = useState<string | null>(null);
  const [expenseCategory,  setExpenseCategory]   = useState("Food");
  const [expenseAmount,    setExpenseAmount]      = useState("");
  const [expenseNote,      setExpenseNote]        = useState("");

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  async function fetchExpenses() {
    setError(null); setSource(null);
    try {
      const { data, error: supaError } = await supabase
        .from("expenses")
        .select("id, note, category, created_at, amount")
        .order("created_at", { ascending: false })
        .limit(10);
      if (supaError) throw supaError;
      setSource("Supabase · expenses");
      setExpenses((data ?? []) as ExpenseRow[]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load data");
      setExpenses(fallbackExpenses);
      setSource("Sample data (fallback)");
    }
  }

  useEffect(() => { fetchExpenses(); }, []);

  const totals = useMemo(() => {
    const list = expenses ?? fallbackExpenses;
    const total = list.reduce((s, x) => s + x.amount, 0);
    const avg   = list.length ? total / list.length : 0;
    return { total, avg, count: list.length };
  }, [expenses]);

  return (
    <div className="min-h-screen bg-[#090c14] text-slate-100">
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onLogout={handleLogout} />

      <div className="lg:grid lg:grid-cols-[240px_1fr]">
        <aside className="hidden h-screen border-r border-[#1e2640] lg:sticky lg:top-0 lg:block">
          <SidebarContent onLogout={handleLogout} />
        </aside>

        <div className="min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-[#1e2640] bg-[#090c14]/85 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setDrawerOpen(true)}
                  className="grid h-9 w-9 place-items-center rounded-[14px] border border-[#1e2640] bg-[#141827] lg:hidden" aria-label="Open menu">
                  <span className="h-4 w-4 rounded bg-slate-500/40" aria-hidden="true" />
                </button>
                <div>
                  <div className="text-base font-semibold leading-6 text-slate-100">Overview</div>
                  <div className="text-xs leading-4 text-slate-600">Wednesday, 5 March 2026</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden items-center lg:flex">
                  <div className="relative w-[280px]">
                    <input placeholder="Search transactions…"
                      className="h-9 w-full rounded-[14px] border border-[#1e2640] bg-[#141827] pl-9 pr-12 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500/70 transition-colors duration-200" />
                    <div className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded bg-slate-500/30" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-[#1e2640] px-2 py-1 text-[12px] leading-[18px] text-slate-600">⌘K</div>
                  </div>
                </div>

                <div className="hidden items-center gap-1 rounded-[14px] border border-[#1e2640] bg-[#141827] px-2 py-1 lg:flex">
                  {["1W","1M","3M","1Y"].map((t) => (
                    <button key={t} type="button"
                      className={cx("h-[22px] rounded-[10px] px-2 text-xs font-medium leading-[18px] transition-all duration-200",
                        t === "1M" ? "bg-indigo-500/15 text-indigo-500" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]")}>
                      {t}
                    </button>
                  ))}
                </div>

                <button type="button" aria-label="Notifications"
                  className="relative grid h-9 w-9 place-items-center rounded-[14px] border border-[#1e2640] bg-[#141827] hover:border-[#2a3460] transition-colors duration-200">
                  <span className="h-4 w-4 rounded bg-slate-500/40" aria-hidden="true" />
                  <span className="absolute right-[11px] top-[7px] h-2 w-2 rounded-full border-2 border-[#0f1320] bg-red-500" />
                </button>

                <div className="grid h-9 w-9 place-items-center rounded-[14px] bg-gradient-to-br from-indigo-500 to-violet-500 hover:scale-105 transition-transform duration-200 cursor-pointer">
                  <span className="text-xs font-bold text-white">AJ</span>
                </div>
              </div>
            </div>
          </header>

          <main className="px-6 pb-12 pt-8">

            {/* ── Stat cards (stagger) ── */}
            <motion.section
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {[
                { tone: "red"    as const, title: "Total Expenses",  value: `$${Math.round(totals.total).toLocaleString()}`, subtitle: `${totals.count} transactions` },
                { tone: "indigo" as const, title: "Avg per Expense", value: `$${Math.round(totals.avg).toLocaleString()}`,   subtitle: "per entry"                     },
                { tone: "violet" as const, title: "Top Category",    value: "Food",                                           subtitle: "most frequent"                  },
                { tone: "amber"  as const, title: "Active Cards",    value: "3",                                              subtitle: "2 virtual"                      },
              ].map((card) => (
                <motion.div key={card.title} variants={cardVariants}>
                  <StatCard {...card} />
                </motion.div>
              ))}
            </motion.section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[368px_1fr]">

              {/* ── Left column ── */}
              <div className="space-y-6">

                {/* Net Worth */}
                <motion.div
                  className="rounded-2xl border border-[#1e2640] bg-[#141827] p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-[#2a3460] hover:scale-[1.01] hover:shadow-xl"
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[1.2px] text-slate-600">Net worth</div>
                      <div className="mt-1 text-2xl font-bold tracking-[-0.5px] text-slate-100">$162,576.25</div>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-400">~ +12.4%</span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      { name: "Main Account", amount: "$48,320.50", tone: "bg-indigo-500"  },
                      { name: "Savings",      amount: "$23,015.00", tone: "bg-violet-500"  },
                      { name: "Investment",   amount: "$91,240.75", tone: "bg-emerald-500" },
                    ].map((a) => (
                      <div key={a.name}
                        className="group/row flex items-center justify-between rounded-[14px] border border-[#161d30] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.05] hover:border-[#2a3460] transition-all duration-200 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={cx("h-7 w-7 rounded-full opacity-20 group-hover/row:opacity-40 transition-opacity duration-200", a.tone)} />
                          <div>
                            <div className="text-xs font-semibold text-slate-200">{a.name}</div>
                            <div className="text-xs text-slate-600">•••• 4291</div>
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-slate-100 group-hover/row:text-white transition-colors duration-200">{a.amount}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Spending by Category */}
                <motion.div
                  className="rounded-2xl border border-[#1e2640] bg-[#141827] p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-[#2a3460] hover:scale-[1.01] hover:shadow-xl"
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-sm font-semibold text-slate-100">Spending by Category</div>
                  <div className="text-xs text-slate-600">$12,000 total</div>
                  <SpendingChart />
                </motion.div>

              </div>

              {/* ── Right column ── */}
              <div className="space-y-6">

                {/* Income vs Expenses */}
                <motion.div
                  className="rounded-2xl border border-[#1e2640] bg-[#141827] p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-[#2a3460] hover:scale-[1.005] hover:shadow-xl"
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.25 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-100">Income vs Expenses</div>
                      <div className="text-xs text-slate-600">Last 6 months overview</div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" />Income</span>
                      <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" />Expenses</span>
                    </div>
                  </div>
                  <div className="mt-4 h-[240px] overflow-hidden rounded-[16px] border border-[#161d30]">
                    <IncomeExpenseChart />
                  </div>
                </motion.div>

                {/* Recent Expenses */}
                <motion.div
                  className="rounded-2xl border border-[#1e2640] bg-[#141827] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-[#2a3460] hover:scale-[1.005] hover:shadow-xl"
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.35 }}
                >
                  <div className="flex items-center justify-between px-6 pt-6">
                    <div>
                      <div className="text-sm font-semibold text-slate-100">Recent Expenses</div>
                      <div className="text-xs text-slate-600">
                        {expenses === null ? "Loading…" : `${expenses.length} entries`}
                      </div>
                    </div>
                    <div className="flex rounded-[14px] border border-[#1e2640] bg-[#0f1320] p-1 text-xs">
                      {["All","Recent","Largest"].map((t) => (
                        <button key={t} type="button"
                          className={cx("rounded-[10px] px-3 py-1 font-medium transition-all duration-200",
                            t === "All" ? "bg-indigo-500/15 text-indigo-500" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]")}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4">
                    <TransactionsTable expenses={expenses} source={source} error={error} />
                  </div>
                </motion.div>

              </div>
            </section>
          </main>
        </div>
      </div>

      {/* ── FAB ── */}
      <button type="button"
        onClick={() => { setExpenseMessage(null); setExpenseOpen(true); }}
        className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-[14px] bg-gradient-to-b from-indigo-500 to-violet-500 text-white shadow-[0px_14px_30px_0px_rgba(99,102,241,0.25)] hover:scale-110 hover:shadow-[0px_18px_40px_0px_rgba(99,102,241,0.4)] active:scale-95 transition-all duration-200"
        aria-label="Add expense">
        <PlusIcon className="h-5 w-5" />
      </button>

      {/* ── Add expense modal ── */}
      {expenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" role="dialog" aria-modal="true">
          <motion.div className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => setExpenseOpen(false)} />

          <motion.div
            className="relative w-full max-w-[440px] rounded-2xl border border-[#1e2640] bg-[#141827] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-slate-100">Add Expense</div>
                  <div className="mt-1 text-sm text-slate-600">Fill in the details below.</div>
                </div>
                <button type="button" onClick={() => setExpenseOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-[14px] border border-[#1e2640] bg-[#0f1320] text-slate-400 hover:bg-white/[0.03] hover:text-slate-200 transition-colors duration-150">
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>

              <form className="mt-6 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setExpenseMessage(null);
                  setExpenseSubmitting(true);
                  try {
                    const parsed = Number(expenseAmount);
                    if (!Number.isFinite(parsed) || parsed <= 0) throw new Error("Amount must be a positive number.");
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error("You must be logged in to add an expense.");
                    const { error: insertError } = await supabase.from("expenses").insert({
                      user_id: user.id, category: expenseCategory, amount: parsed,
                      note: expenseNote.trim() || null,
                    });
                    if (insertError) throw insertError;
                    setExpenseMessage("Expense saved successfully.");
                    setExpenseAmount(""); setExpenseNote("");
                    await fetchExpenses();
                    setTimeout(() => { setExpenseOpen(false); setExpenseMessage(null); }, 1000);
                  } catch (err: unknown) {
                    setExpenseMessage(err instanceof Error ? err.message : "Failed to save expense.");
                  } finally {
                    setExpenseSubmitting(false);
                  }
                }}>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Category</label>
                  <select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} disabled={expenseSubmitting}
                    className="h-10 w-full appearance-none rounded-[14px] border border-[#1e2640] bg-[#0f1320] px-3 text-sm text-slate-100 outline-none focus:border-indigo-500/70 transition-colors duration-150">
                    {["Food","Transport","Shopping","Bills","Entertainment","Other"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Amount</label>
                  <input type="number" inputMode="decimal" step="0.01" min="0.01" placeholder="0.00"
                    value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} disabled={expenseSubmitting}
                    className="h-10 w-full rounded-[14px] border border-[#1e2640] bg-[#0f1320] px-3 text-sm text-slate-100 placeholder:text-[rgba(241,245,249,0.35)] outline-none focus:border-indigo-500/70 transition-colors duration-150" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">
                    Note <span className="text-slate-600">(optional)</span>
                  </label>
                  <input type="text" placeholder="e.g. Lunch at café"
                    value={expenseNote} onChange={(e) => setExpenseNote(e.target.value)} disabled={expenseSubmitting}
                    className="h-10 w-full rounded-[14px] border border-[#1e2640] bg-[#0f1320] px-3 text-sm text-slate-100 placeholder:text-[rgba(241,245,249,0.35)] outline-none focus:border-indigo-500/70 transition-colors duration-150" />
                </div>

                {expenseMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className={cx("rounded-[14px] border border-[#1e2640] px-3 py-2 text-xs",
                      expenseMessage.includes("successfully") ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300")}>
                    {expenseMessage}
                  </motion.div>
                )}

                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setExpenseOpen(false)} disabled={expenseSubmitting}
                    className="h-10 rounded-[14px] border border-[#1e2640] bg-[#0f1320] text-sm font-semibold text-slate-300 hover:bg-white/[0.03] hover:text-white transition-colors duration-150">
                    Cancel
                  </button>
                  <button type="submit" disabled={expenseSubmitting || !expenseAmount}
                    className="h-10 rounded-[14px] bg-gradient-to-b from-indigo-500 to-violet-500 text-sm font-semibold text-white shadow-[0px_8px_18px_0px_rgba(99,102,241,0.25)] hover:shadow-[0px_10px_24px_0px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none">
                    {expenseSubmitting ? "Saving…" : "Save Expense"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
