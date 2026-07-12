import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

export default function RequireAuth() {
  const { user, checkingSession } = useAuth();

  if (checkingSession) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-driftwood gap-3">
        <div className="text-5xl animate-pulse">📖</div>
        <div>Checking your session…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
