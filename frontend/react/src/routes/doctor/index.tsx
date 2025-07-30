import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { DoctorDashboard } from '../../components/dashboards/DoctorDashboard';
import PatientRoutes from './PatientRoutes';
import DiseaseRoutes from './DiseaseRoutes';
import AIRoutes from './AIRoutes';
import { DoctorShell } from './DoctorShell';

export default function DoctorArea() {
  return (
    <Routes>
      <Route element={<DoctorShell />}>
        <Route index element={<DoctorDashboard />} />
        <Route path="patients/*" element={<PatientRoutes />} />
        <Route path="diseases/*" element={<DiseaseRoutes />} />
        <Route path="ai/*" element={<AIRoutes />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Route>
    </Routes>
  );
}