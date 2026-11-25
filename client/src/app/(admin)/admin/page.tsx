"use client";

import Link from "next/link";
import {
  Users,
  GraduationCap,
  UserPlus,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { mockAdmin } from "@/lib/mockAdmin";

export default function AdminDashboardPage() {
  const { user } = useUser();
  const activeStudents = mockAdmin.students.filter((s) => s.status === "active").length;
  const totalCourses = mockAdmin.lecturers.reduce((s, l) => s + l.courses, 0);

  const cards = [
    { label: "Students", value: mockAdmin.students.length, hint: `${activeStudents} active`, icon: Users },
    { label: "Lecturers", value: mockAdmin.lecturers.length, hint: "Teaching staff", icon: GraduationCap },
    { label: "Courses", value: totalCourses, hint: "Assigned across staff", icon: BookOpen },
    { label: "Registered this week", value: 2, hint: "Students + lecturers", icon: UserPlus, accent: "accent" as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">
          Welcome, {user?.name?.split(" ")[0] ?? "Admin"}
        </h1>
        <p className="text-muted text-sm">Manage users and oversee registration</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, hint, icon: Icon, accent }) => (
          <div key={label} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-muted text-xs font-medium uppercase tracking-wide">{label}</p>
              <Icon className="h-4 w-4 text-muted" />
            </div>
            <p
              className={`font-display mt-2 text-2xl font-bold tabular ${
                accent === "accent" ? "text-accent" : ""
              }`}
            >
              {value}
            </p>
            <p className="text-muted mt-1 text-xs">{hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/students/new"
          className="group flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition hover:border-primary"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold">Register a student</p>
              <p className="text-muted text-xs">Add a new ND or MTI student</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5" />
        </Link>

        <Link
          href="/admin/lecturers/new"
          className="group flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition hover:border-primary"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold">Register a lecturer</p>
              <p className="text-muted text-xs">Add new teaching staff</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-display text-sm font-semibold">Recent students</h2>
            <Link href="/admin/students" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {mockAdmin.students.slice(0, 3).map((s) => (
              <li key={s.regNo} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-muted text-xs font-mono">{s.regNo}</p>
                </div>
                <span className="text-muted text-xs">{s.level}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-surface">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-display text-sm font-semibold">Recent lecturers</h2>
            <Link href="/admin/lecturers" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {mockAdmin.lecturers.slice(0, 3).map((l) => (
              <li key={l.staffNo} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{l.name}</p>
                  <p className="text-muted text-xs font-mono">{l.staffNo}</p>
                </div>
                <span className="text-muted text-xs">{l.rank}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}