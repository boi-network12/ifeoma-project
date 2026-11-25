"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { mockAdmin } from "@/lib/mockAdmin";
import { UsersTable, StatusPill, type Column } from "../../_components/UsersTable";
import type { AdminStudentRow } from "@/lib/mockAdmin";

export default function AdminStudentsPage() {
  const columns: Column<AdminStudentRow>[] = [
    {
      key: "regNo",
      label: "Reg No",
      render: (r) => <span className="font-mono text-xs">{r.regNo}</span>,
    },
    { key: "name", label: "Name" },
    { key: "program", label: "Program" },
    { key: "department", label: "Department" },
    { key: "level", label: "Level", align: "center" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (r) => <StatusPill status={r.status} />,
    },
    {
      key: "createdAt",
      label: "Added",
      align: "right",
      render: (r) => <span className="text-muted text-xs">{r.createdAt}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Students</h1>
          <p className="text-muted text-sm">{mockAdmin.students.length} students registered</p>
        </div>
        <Link
          href="/admin/students/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <UserPlus className="h-4 w-4" /> Register student
        </Link>
      </div>

      <UsersTable
        rows={mockAdmin.students}
        columns={columns}
        searchKeys={["regNo", "name", "department", "email"]}
        searchPlaceholder="Search by name, reg no, department…"
        emptyText="No students registered yet."
      />
    </div>
  );
}