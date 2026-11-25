import { ProtectedRoute } from "../_components/ProtectedRoute";


export default function LecturersLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["lecturer", "admin"]}>
      {children}
    </ProtectedRoute>
  );
}