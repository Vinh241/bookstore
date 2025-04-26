import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
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

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
