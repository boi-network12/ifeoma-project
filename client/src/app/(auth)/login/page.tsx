"use client";

import { useState } from "react";
import { useUser, Role } from "@/context/UserContext";
import { useRouter } from "next/navigation";

type LoginError = { field?: "regNo" | "password" | "form"; message: string } | null;

/** Where each role lands after login. Add new roles here only. */
const ROLE_HOME: Record<Role, string> = {
  student: "/students",
  lecturer: "/lecturers",
  admin: "/admin",
};

/** Mock display name per role — replace with backend data later. */
const MOCK_NAMES: Record<Role, string> = {
  student: "Ifeoma (Student)",
  lecturer: "Dr. Ada (Lecturer)",
  admin: "Ifeoma (Admin)",
};

/** Infer role from the registration / staff / admin number format.
 *  Students:  YYYY/YYYY/<ND|MTI>/<DEPT>/<NNNN>
 *  Lecturers: YYYY/YYYY/NUT/<NNN>
 *  Admins:    YYYY/YYYY/ADMIN/<NNN>
 *  This is a stand-in for the backend lookup — keep the same function name
 *  so you can swap it for a fetch("/api/login") later.
 */
function inferRole(regNo: string): Role | null {
  const studentPattern  = /^\d{4}\/\d{4}\/(ND|MTI)\/[A-Z]{2,4}\/\d{3,5}$/i;
  const lecturerPattern = /^\d{4}\/\d{4}\/NUT\/\d{2,4}$/i;
  const adminPattern    = /^\d{4}\/\d{4}\/ADMIN\/\d{2,4}$/i;

  if (studentPattern.test(regNo))  return "student";
  if (lecturerPattern.test(regNo)) return "lecturer";
  if (adminPattern.test(regNo))    return "admin";
  return null;
}

export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();

  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<LoginError>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = regNo.trim();

    if (!trimmed) {
      setError({ field: "regNo", message: "Enter your registration or staff number." });
      return;
    }
    if (!password) {
      setError({ field: "password", message: "Enter your password." });
      return;
    }

    const role = inferRole(trimmed);
    if (!role) {
      setError({
        field: "regNo",
        message:
          "Unrecognized number. Students: 2023/2024/ND/CS/1042. Lecturers: 1999/2000/NUT/204. Admins: 2023/2024/ADMIN/101.",
      });
      return;
    }

    setSubmitting(true);
    // Mock latency so the UI feels real; remove when backend is live.
    setTimeout(() => {
      login({ id: trimmed, name: MOCK_NAMES[role], role });
      router.push(ROLE_HOME[role]);
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Acadex
          </h1>
          <p className="text-muted mt-1 text-sm">
            Student Result Processing &amp; Management
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
        >
          <h2 className="font-display text-xl font-semibold">Sign in</h2>
          <p className="text-muted mt-1 text-sm">
            Use your registration number (students), staff number (lecturers), or admin ID.
          </p>

          {/* Reg No */}
          <div className="mt-6">
            <label htmlFor="regNo" className="block text-sm font-medium">
              Registration / Staff / Admin Number
            </label>
            <input
              id="regNo"
              name="regNo"
              type="text"
              autoComplete="username"
              placeholder="2023/2024/ND/CS/1042"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              aria-invalid={error?.field === "regNo"}
              aria-describedby={error?.field === "regNo" ? "regNo-error" : undefined}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
            {error?.field === "regNo" && (
              <p id="regNo-error" className="mt-1 text-xs text-destructive">
                {error.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-xs font-medium text-primary hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={error?.field === "password"}
              aria-describedby={error?.field === "password" ? "password-error" : undefined}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
            {error?.field === "password" && (
              <p id="password-error" className="mt-1 text-xs text-destructive">
                {error.message}
              </p>
            )}
          </div>

          {/* Form-level error */}
          {error?.field === "form" && (
            <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-muted mt-4 text-center text-xs">
            Your role is detected automatically from your number.
          </p>
        </form>

        <p className="text-muted mt-6 text-center text-xs">
          Trouble signing in? Contact the ICT unit.
        </p>
      </div>
    </div>
  );
}