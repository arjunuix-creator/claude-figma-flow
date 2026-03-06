"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";

export type ExpenseRow = {
  id: string;
  note: string | null;
  category: string;
  created_at: string;
  amount: number;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatMoney(amount: number) {
  return Math.abs(amount).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDateShort(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
}

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

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show:   (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const },
  }),
};

export default function TransactionsTable({
  expenses,
  source,
  error,
}: {
  expenses: ExpenseRow[] | null;
  source: string | null;
  error: string | null;
}) {
  return (
    <>
      {/* Status bar */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-600">{source ?? "Loading…"}</div>
        {error && (
          <div className="rounded-[14px] border border-[#1e2640] bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Column headers */}
      <div className="hidden grid-cols-[1.3fr_0.8fr_0.8fr_0.6fr] gap-4 border-b border-[#161d30] pb-3 text-[11px] font-semibold uppercase tracking-[1.2px] text-slate-600 sm:grid">
        <div>Note</div>
        <div>Category</div>
        <div>Date</div>
        <div className="text-right">Amount</div>
      </div>

      {/* Rows */}
      {expenses === null ? (
        <div className="py-6 text-sm text-slate-600">Loading transactions…</div>
      ) : expenses.length === 0 ? (
        <div className="py-6 text-sm text-slate-600">
          No expenses yet. Add one with the + button.
        </div>
      ) : (
        <motion.div
          className="divide-y divide-[#161d30]"
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {expenses.map((row, i) => (
              <motion.div
                key={String(row.id)}
                custom={i}
                variants={rowVariants}
                className="group/row grid grid-cols-[1fr_auto] items-center gap-4 py-4 sm:grid-cols-[1.3fr_0.8fr_0.8fr_0.6fr] hover:bg-[#141827]/40 rounded-[10px] px-2 -mx-2 transition-colors duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.03] group-hover/row:bg-white/[0.07] transition-colors duration-200">
                    <span className="text-xs font-semibold text-slate-400">
                      {(row.note ?? row.category).slice(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-100 group-hover/row:text-white transition-colors duration-150">
                      {row.note ?? <span className="italic text-slate-500">No note</span>}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-600 sm:hidden">
                      <Badge label={row.category} />
                      <span>{formatDateShort(row.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <Badge label={row.category} />
                </div>
                <div className="hidden text-sm text-slate-600 sm:block">
                  {formatDateShort(row.created_at)}
                </div>
                <div className="text-right text-sm font-semibold text-red-400 group-hover/row:text-red-300 transition-colors duration-150">
                  -{formatMoney(row.amount)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="mt-3 border-t border-[#161d30] pt-3 text-xs text-slate-600">
        Showing {expenses?.length ?? 0} entries
      </div>
    </>
  );
}
