"use client";

import { useMemo, useState } from "react";
import { Search, MoreVertical } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
}

export function UsersTable<T extends { status: "active" | "suspended"; email: string }>({
  rows,
  columns,
  searchKeys,
  searchPlaceholder = "Search…",
  emptyText = "No records yet.",
}: {
  rows: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  searchPlaceholder?: string;
  emptyText?: string;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) =>
      searchKeys.some((k) => String(r[k]).toLowerCase().includes(needle))
    );
  }, [q, rows, searchKeys]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                {columns.map((c) => (
                  <th
                    key={String(c.key)}
                    className={`px-4 py-2 text-${c.align ?? "left"}`}
                  >
                    {c.label}
                  </th>
                ))}
                <th className="w-10 px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted">
                    {emptyText}
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    {columns.map((c) => (
                      <td
                        key={String(c.key)}
                        className={`px-4 py-2 text-${c.align ?? "left"}`}
                      >
                        {c.render
                          ? c.render(row)
                          : String((row as Record<string, unknown>)[c.key as string] ?? "—")}
                      </td>
                    ))}
                    <td className="px-2 py-2">
                      <button className="rounded p-1 hover:bg-background" aria-label="Row actions">
                        <MoreVertical className="h-4 w-4 text-muted" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted">
        {filtered.length} of {rows.length} record{rows.length === 1 ? "" : "s"} shown
      </p>
    </div>
  );
}

export function StatusPill({ status }: { status: "active" | "suspended" }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        status === "active"
          ? "bg-accent/10 text-accent"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      {status === "active" ? "Active" : "Suspended"}
    </span>
  );
}