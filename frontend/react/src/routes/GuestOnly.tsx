import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/** Redirects logged-in users away from /login */
export const GuestOnly: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;
  if (user) return <Navigate to="/dashboard" state={{ from: location }} replace />;
  return children;
};
