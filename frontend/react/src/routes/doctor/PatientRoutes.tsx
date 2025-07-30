import { Routes, Route } from "react-router-dom";
import { ViewPatient }    from "../../pages/patients/viewPatient";
import { AssignDisease }  from "../../pages/patients/AssginDisease";
import { PatientManagement } from "../../components/doctor/PatientManagement";

export default function PatientRoutes() {
  return (
   <Routes>
      <Route index element={<PatientManagement />} />
      <Route path="view/:id" element={<ViewPatient />} />
      <Route path="assign-disease/:id" element={<AssignDisease />} />
    </Routes>
  );
}
