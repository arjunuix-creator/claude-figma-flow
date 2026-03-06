"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell } from "recharts";

const CATEGORIES = [
  { label: "Food",      pct: "35%", w: "35%", dot: "bg-emerald-500", color: "#10b981", value: 35 },
  { label: "Transport", pct: "23%", w: "23%", dot: "bg-indigo-500",  color: "#6366f1", value: 23 },
  { label: "Shopping",  pct: "16%", w: "16%", dot: "bg-violet-500",  color: "#8b5cf6", value: 16 },
  { label: "Bills",     pct: "26%", w: "26%", dot: "bg-amber-500",   color: "#f59e0b", value: 26 },
];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function SpendingChart() {
  const [barsReady, setBarsReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsReady(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mt-5 grid grid-cols-[120px_1fr] gap-6">
      {/* Donut chart */}
      <div className="grid place-items-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
          className="relative h-[120px] w-[120px] hover:scale-105 transition-transform duration-300 cursor-default"
        >
          <PieChart width={120} height={120}>
            <Pie
              data={CATEGORIES}
              cx={55}
              cy={55}
              innerRadius={36}
              outerRadius={55}
              dataKey="value"
              isAnimationActive
              animationDuration={900}
              strokeWidth={0}
            >
              {CATEGORIES.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-semibold text-slate-500">4 cats</span>
          </div>
        </motion.div>
      </div>

      {/* Category legend with animated bars */}
      <div className="space-y-3 pt-2">
        {CATEGORIES.map((c, i) => (
          <div
            key={c.label}
            className="group/bar flex items-center gap-3 cursor-default"
          >
            <span className={cx("h-2 w-2 rounded-full shrink-0", c.dot)} />
            <span className="w-20 text-xs text-slate-400 group-hover/bar:text-slate-200 transition-colors duration-200">
              {c.label}
            </span>
            <span className="h-1.5 flex-1 rounded-full bg-[#1e2640] overflow-hidden">
              <span
                className={cx("block h-1.5 rounded-full", c.dot)}
                style={{
                  width: barsReady ? c.w : "0%",
                  transition: `width 0.8s cubic-bezier(0.4,0,0.2,1) ${0.1 + i * 0.12}s`,
                }}
              />
            </span>
            <span className="w-10 text-right text-xs font-medium text-slate-600 group-hover/bar:text-slate-400 transition-colors duration-200">
              {c.pct}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
