import type { SemesterResult } from "@/lib/mockStudent";

function gradeColor(grade: string) {
  if (grade === "A") return "text-accent";
  if (grade === "B") return "text-primary";
  if (grade === "C") return "text-warning";
  if (grade === "F") return "text-destructive";
  return "text-foreground";
}

export function ResultTable({ result }: { result: SemesterResult }) {
  const totalUnits = result.courses.reduce((s, c) => s + c.units, 0);
  const totalScore = result.courses.reduce((s, c) => s + c.score, 0);
  const average = result.courses.length ? totalScore / result.courses.length : 0;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <h2 className="font-display font-semibold">
            {result.session} — {result.semester} Semester
          </h2>
          <p className="text-muted text-xs">{result.level} · {result.courses.length} courses · {totalUnits} units</p>
        </div>
        <p className="text-muted text-sm">
          Average: <span className="font-semibold tabular text-foreground">{average.toFixed(1)}%</span>
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background text-muted text-left text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Course Title</th>
              <th className="px-4 py-2 text-center">Units</th>
              <th className="px-4 py-2 text-right">Score</th>
              <th className="px-4 py-2 text-center">Grade</th>
              <th className="px-4 py-2 text-center">Remark</th>
            </tr>
          </thead>
          <tbody>
            {result.courses.map((c) => (
              <tr key={c.code} className="border-t border-border">
                <td className="px-4 py-2 font-mono text-xs">{c.code}</td>
                <td className="px-4 py-2">{c.title}</td>
                <td className="px-4 py-2 text-center tabular">{c.units}</td>
                <td className="px-4 py-2 text-right tabular">{c.score}</td>
                <td className={`px-4 py-2 text-center font-semibold ${gradeColor(c.grade)}`}>{c.grade}</td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.remark === "Pass"
                        ? "bg-accent/10 text-accent"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {c.remark}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}