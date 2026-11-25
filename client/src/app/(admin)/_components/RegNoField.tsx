"use client";

import { IdCard, Check, X } from "lucide-react";

export function RegNoField({
  value,
  onChange,
  kind,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  kind: "student" | "lecturer";
  error?: string;
}) {
  // Same regexes as the login page, imported from mockAdmin
  const STUDENT = /^\d{4}\/\d{4}\/(ND|MTI)\/[A-Z]{2,4}\/\d{3,5}$/i;
  const LECTURER = /^\d{4}\/\d{4}\/NUT\/\d{2,4}$/i;
  const pattern = kind === "student" ? STUDENT : LECTURER;
  const valid = pattern.test(value.trim());
  const touched = value.trim().length > 0;

  // Pretty preview
  let preview = "";
  if (valid) {
    const parts = value.trim().split("/");
    if (kind === "student") preview = `${parts[2].toUpperCase()} · Dept ${parts[3].toUpperCase()} · No. ${parts[4]}`;
    else preview = `Lecturer · No. ${parts[3]}`;
  }

  return (
    <div>
      <label htmlFor="regNo" className="block text-sm font-medium">
        {kind === "student" ? "Registration Number" : "Staff Number"}
      </label>
      <div className="relative mt-1">
        <IdCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          id="regNo"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            kind === "student" ? "2023/2024/ND/CS/1042" : "1999/2000/NUT/204"
          }
          className={`w-full rounded-lg border bg-background py-2 pl-9 pr-9 font-mono text-sm outline-none transition ${
            error
              ? "border-destructive focus:border-destructive"
              : touched && valid
              ? "border-accent focus:border-accent"
              : "border-border focus:border-primary focus:ring-2 focus:ring-ring/30"
          }`}
          aria-invalid={!!error || (touched && !valid)}
        />
        {touched && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {valid ? (
              <Check className="h-4 w-4 text-accent" />
            ) : (
              <X className="h-4 w-4 text-destructive" />
            )}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      {!error && touched && valid && (
        <p className="mt-1 text-xs text-accent">{preview}</p>
      )}
      {!error && touched && !valid && (
        <p className="mt-1 text-xs text-destructive">
          {kind === "student"
            ? "Use the format YYYY/YYYY/ND|MTI/DEPT/NNNN."
            : "Use the format YYYY/YYYY/NUT/NNN."}
        </p>
      )}
    </div>
  );
}