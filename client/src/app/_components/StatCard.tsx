import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  accent = "primary",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: "primary" | "accent" | "warning" | "destructive";
}) {
  const accentClass = {
    primary: "text-primary",
    accent: "text-accent",
    warning: "text-warning",
    destructive: "text-destructive",
  }[accent];

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-muted text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className={`font-display mt-2 text-2xl font-bold tabular ${accentClass}`}>{value}</p>
      {hint && <p className="text-muted mt-1 text-xs">{hint}</p>}
    </div>
  );
}