import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../entities";
import { ROLE_HOME } from "../config/constants";

import { AdminDashboard } from "../components/dashboards/AdminDashboard";
import { DoctorDashboard } from "../components/dashboards/DoctorDashboard";
import { NurseDashboard } from "../components/dashboards/NurseDashboard";

import { Layout } from "../components/Layout";

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect users to their role-specific areas
    if (!isLoading && user) {
      const rolePath = ROLE_HOME[user.role];
      if (rolePath && rolePath !== '/dashboard') {
        navigate(rolePath, { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return null;

  if (!user) return <Navigate to="/login" replace />;

  // If we're still here and not redirected, show the dashboard
  let content: React.ReactElement;
  switch (user.role) {
    case UserRole.ADMIN:
      content = <AdminDashboard />;
      break;
    case UserRole.DOCTOR:
      content = <DoctorDashboard />;
      break;
    case UserRole.NURSE:
      content = <NurseDashboard />;
      break;
    default:
      content = <div className="p-4 text-red-600">Invalid user role</div>;
  }

  return <Layout>{content}</Layout>;
};

export default DashboardPage;
