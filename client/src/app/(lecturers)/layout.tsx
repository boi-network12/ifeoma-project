
import { ProtectedRoute } from "../_components/ProtectedRoute";
import { LecturerShell } from "./_components/LecturerShell";

export const instant = false;

export default function LecturersLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["lecturer"]}>
      <LecturerShell>{children}</LecturerShell>
    </ProtectedRoute>
  );
}