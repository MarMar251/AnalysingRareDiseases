import { Routes, Route } from "react-router-dom";
import { CreatePatient } from "../../pages/patients/createPatient";
import { EditPatient } from "../../pages/patients/editPatient";
import { ViewPatient }    from "../../pages/patients/viewPatient";

export default function PatientRoutes() {
  return (
    <Routes>
      <Route path="view/:id" element={<ViewPatient />} />
      <Route path="new" element={<CreatePatient />} />
      <Route path=":id/edit" element={<EditPatient />} />
    </Routes>
  );
}
