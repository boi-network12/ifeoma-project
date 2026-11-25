
import { ProtectedRoute } from "../_components/ProtectedRoute";
import { AdminShell } from "./_components/AdminShell";

export const instant = false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminShell>{children}</AdminShell>
    </ProtectedRoute>
  );
}