import { Routes, Route } from 'react-router-dom';
import { DiseaseManagement } from '../../components/doctor/DiseaseManagement';
import { CreateDisease } from '../../pages/disease/CreateDisease';
import { ViewDisease } from '../../pages/disease/ViewDisease';
import { EditDisease } from '../../pages/disease/EditDisease';

export default function DiseaseRoutes() {
  return (
    <Routes>
      <Route index element={<DiseaseManagement />} />
      <Route path="create" element={<CreateDisease />} />
      <Route path="view/:id" element={<ViewDisease />} />
      <Route path="edit/:id" element={<EditDisease />} />
    </Routes>
  );
}