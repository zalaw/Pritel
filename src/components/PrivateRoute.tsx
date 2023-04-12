import { useAuth } from "../contexts/AuthContext";
import { useLocation, Outlet, Navigate } from "react-router-dom";

interface PrivateRouteProps {
  adminOnly?: boolean;
}

export default function PrivateRoute({ adminOnly = false }: PrivateRouteProps) {
  const { currentUser, userLoading } = useAuth();
  const location = useLocation();

  if (userLoading) return null;

  if (!currentUser) return <Navigate to="/signin" state={{ from: location }} replace />;

  if (adminOnly && !currentUser.user.admin) return <Navigate to="/unauthorized" state={{ from: location }} replace />;

  return <Outlet />;
}
