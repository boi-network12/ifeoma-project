import { ProtectedRoute } from "../_components/ProtectedRoute";


export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      {children}
    </ProtectedRoute>
  );
}