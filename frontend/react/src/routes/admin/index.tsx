import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { Layout } from "../../components/Layout";
import { AdminDashboard } from "../../components/dashboards/AdminDashboard";
import UserRoutes from "./UserRoutes";

const AdminArea: React.FC = () => (
  <Layout>
    <Routes>
      {/* default → redirect to overview */}
      <Route index element={<Navigate to="overview" replace />} />

      {/* overview route */}
      <Route path="overview" element={<AdminDashboard />} />

      {/* nested CRUD routes for system users */}
      <Route path="users/*" element={<UserRoutes />} />

      {/* fallback: unknown paths → overview */}
      <Route path="*" element={<Navigate to="overview" replace />} />
    </Routes>
  </Layout>
);

export default AdminArea;
