"use client";

import { useMemo, useState } from "react";
import { Download, ChevronDown, Award, AlertTriangle, BookOpen } from "lucide-react";
import { mockStudent } from "@/lib/mockStudent";
import { StatCard } from "@/app/_components/StatCard";

function gradePoint(score: number) {
  if (score >= 70) return 5;
  if (score >= 60) return 4;
  if (score >= 50) return 3;
  if (score >= 45) return 2;
  if (score >= 40) return 1;
  return 0;
}

function gradeFromScore(score: number) {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  if (score >= 40) return "E";
  return "F";
}

function semesterGPA(courses: { units: number; score: number }[]) {
  const units = courses.reduce((s, c) => s + c.units, 0);
  if (!units) return 0;
  const points = courses.reduce((s, c) => s + gradePoint(c.score) * c.units, 0);
  return points / units;
}

export default function ResultsPage() {
  const [openSession, setOpenSession] = useState<string | null>(
    `${mockStudent.results[0].session}-${mockStudent.results[0].semester}`
  );

  const stats = useMemo(() => {
    const all = mockStudent.results.flatMap((r) => r.courses);
    const failed = all.filter((c) => c.remark === "Fail").length;
    const best = all.reduce((b, c) => (c.score > b.score ? c : b), all[0]);
    return { total: all.length, failed, best };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">My Results</h1>
          <p className="text-muted text-sm">
            {mockStudent.regNo} · {mockStudent.program}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface"
        >
          <Download className="h-4 w-4" /> Print / Save PDF
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="CGPA" value={mockStudent.cgpa.toFixed(2)} accent="accent" hint="Cumulative" />
        <StatCard label="Courses taken" value={stats.total} hint="All semesters" />
        <StatCard
          label="Failed"
          value={stats.failed}
          accent={stats.failed ? "destructive" : "accent"}
          hint="All semesters"
        />
        <StatCard
          label="Best course"
          value={stats.best?.grade ?? "—"}
          hint={`${stats.best?.code} · ${stats.best?.score}%`}
        />
      </div>

      <div className="space-y-3">
        {mockStudent.results.map((r) => {
          const key = `${r.session}-${r.semester}`;
          const isOpen = openSession === key;
          const gpa = semesterGPA(r.courses);
          const units = r.courses.reduce((s, c) => s + c.units, 0);

          return (
            <section key={key} className="overflow-hidden rounded-xl border border-border bg-surface">
              <button
                onClick={() => setOpenSession(isOpen ? null : key)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-background/40"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-muted" />
                  <div>
                    <p className="font-display text-sm font-semibold">
                      {r.session} — {r.semester} Semester
                    </p>
                    <p className="text-muted text-xs">
                      {r.level} · {r.courses.length} courses · {units} units
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-muted text-xs">GPA</p>
                    <p className="font-display font-bold tabular text-accent">
                      {gpa.toFixed(2)}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-background text-muted text-left text-xs uppercase tracking-wide">
                      <tr>
                        <th className="px-4 py-2">Code</th>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2 text-center">Units</th>
                        <th className="px-4 py-2 text-right">Score</th>
                        <th className="px-4 py-2 text-center">Grade</th>
                        <th className="px-4 py-2 text-center">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.courses.map((c) => (
                        <tr key={c.code} className="border-t border-border">
                          <td className="px-4 py-2 font-mono text-xs">{c.code}</td>
                          <td className="px-4 py-2">{c.title}</td>
                          <td className="px-4 py-2 text-center tabular">{c.units}</td>
                          <td className="px-4 py-2 text-right tabular">{c.score}</td>
                          <td className="px-4 py-2 text-center font-semibold">
                            {gradeFromScore(c.score)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                c.remark === "Pass"
                                  ? "bg-accent/10 text-accent"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {c.remark === "Pass" ? (
                                <Award className="h-3 w-3" />
                              ) : (
                                <AlertTriangle className="h-3 w-3" />
                              )}
                              {c.remark}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}