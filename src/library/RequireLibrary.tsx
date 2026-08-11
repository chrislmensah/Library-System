import { Navigate, Outlet } from "react-router-dom";
import { useLibrary } from "./LibraryContext";

/**
 * Wrap the /dashboard/* route tree with this. If the user has no
 * library yet, they're sent to /create-library instead of landing
 * on an admin shell with nothing to manage.
 */
export function RequireLibrary() {
  const { currentLibrary } = useLibrary();

  if (!currentLibrary) {
    return <Navigate to="/create-library" replace />;
  }

  return <Outlet />;
}