import { Routes, Route, Navigate } from "react-router-dom";
import { NurseDashboard } from "../../components/dashboards/NurseDashboard";
import PatientRoutes from "./PatientRoutes";
import { Layout } from "../../components/Layout";
import { RequireRole } from "../../components/auth/RequireRole";
import { UserRole } from "../../entities";

export default function NurseArea() {
  return (
    <RequireRole allow={[UserRole.NURSE]}>
      <Layout>
        <Routes>
          <Route index element={<NurseDashboard />} />
          <Route path="patients/*" element={<PatientRoutes />} />
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </Layout>
    </RequireRole>
  );
}
