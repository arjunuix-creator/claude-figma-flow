"use client";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#141827] border border-[#1e2640] rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs text-slate-400 mb-1 font-medium">{label}</p>
      <p className="text-sm text-indigo-400">Income: ${payload[0]?.value?.toLocaleString()}</p>
      <p className="text-sm text-red-400">Expenses: ${payload[1]?.value?.toLocaleString()}</p>
    </div>
  );
}
