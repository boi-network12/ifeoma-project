"use client";

import { useMemo, useState } from "react";
import { Check, AlertCircle, Save } from "lucide-react";
import type { EnrolledStudent } from "@/lib/mockLecturer";
import { gradeFromScore } from "@/lib/mockLecturer";

function gradeBadge(score: number | null) {
  const g = gradeFromScore(score);
  const map: Record<string, string> = {
    A: "bg-accent/10 text-accent",
    B: "bg-primary/10 text-primary",
    C: "bg-warning/10 text-warning",
    D: "bg-warning/10 text-warning",
    E: "bg-destructive/10 text-destructive",
    F: "bg-destructive/10 text-destructive",
    "—": "bg-background text-muted",
  };
  return map[g] ?? "bg-background text-muted";
}

export function ScoreForm({
  initialStudents,
  onSubmit,
}: {
  initialStudents: EnrolledStudent[];
  onSubmit?: (students: EnrolledStudent[]) => void;
}) {
  const [students, setStudents] = useState<EnrolledStudent[]>(initialStudents);
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(initialStudents));
  const [savedNotice, setSavedNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = JSON.stringify(students) !== savedSnapshot;

  const counts = useMemo(() => {
    const entered = students.filter((s) => s.score !== null).length;
    return { entered, total: students.length };
  }, [students]);

  const updateScore = (regNo: string, raw: string) => {
    setError(null);
    if (raw === "") {
      setStudents((prev) =>
        prev.map((s) => (s.regNo === regNo ? { ...s, score: null } : s))
      );
      return;
    }
    const n = Number(raw);
    if (Number.isNaN(n) || n < 0 || n > 100) {
      setError(`Score for ${regNo} must be between 0 and 100.`);
      return;
    }
    setStudents((prev) =>
      prev.map((s) => (s.regNo === regNo ? { ...s, score: n } : s))
    );
  };

  const handleSave = () => {
    if (error) return;
    // mock persistence
    onSubmit?.(students);
    setSavedSnapshot(JSON.stringify(students));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Status strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
        <p className="text-sm">
          <span className="font-semibold tabular">{counts.entered}</span>
          <span className="text-muted"> / {counts.total} scores entered</span>
        </p>
        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="flex items-center gap-1 text-xs text-warning">
              <AlertCircle className="h-3 w-3" /> Unsaved changes
            </span>
          )}
          {savedNotice && (
            <span className="flex items-center gap-1 text-xs text-accent">
              <Check className="h-3 w-3" /> Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty || !!error}
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2">Reg No</th>
                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2 text-center">Level</th>
                <th className="px-4 py-2 text-center">Score</th>
                <th className="px-4 py-2 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.regNo} className="border-t border-border">
                  <td className="px-4 py-2 font-mono text-xs">{s.regNo}</td>
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2 text-center">{s.level}</td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={s.score ?? ""}
                      onChange={(e) => updateScore(s.regNo, e.target.value)}
                      placeholder="—"
                      className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-center text-sm tabular outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${gradeBadge(
                        s.score
                      )}`}
                    >
                      {gradeFromScore(s.score)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted">
        Scores are saved locally for now. When the backend is connected, saving will submit
        to the results API and lock the row for moderation.
      </p>
    </div>
  );
}