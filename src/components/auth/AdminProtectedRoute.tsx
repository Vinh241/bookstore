import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // While checking authentication status
  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">Đang tải...</div>
    );
  }

  // If not authenticated, redirect to login with redirect back
  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
    );
  }

  // If authenticated but not admin, redirect to home
  if (!user?.is_admin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // If authenticated and admin, render the protected component
  return <>{children}</>;
};

export default AdminProtectedRoute;
