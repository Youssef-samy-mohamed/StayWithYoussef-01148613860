import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../../store"; // Adjust path as necessary
import { useAppSelector } from "../../../store/hooks";
interface ProtectedRouteProps {
  adminRequired?: boolean; // Whether the route requires admin role
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  adminRequired = false,
}) => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const isAuthenticated = Boolean(user); // Check if the user is logged in
  const isAdmin = user?.role === "admin"; // Check if the user is an admin

  if (!isAuthenticated) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" />;
  }

  if (adminRequired && !isAdmin) {
    // Redirect to home if user is not an admin and the route requires admin
    return <Navigate to="/" />;
  }

  // If user is authenticated and admin or a regular user, allow access to the child routes
  return <Outlet />;
};

export default ProtectedRoute;
