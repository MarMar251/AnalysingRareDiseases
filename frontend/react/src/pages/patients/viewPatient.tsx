import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { PatientDetails } from '../../components/details/PatientDetails';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { usePatient } from '../../features/patients/hooks';
import { usePatientDiseases } from '../../features/patient-diseases/hooks';
import { useAuth } from '../../contexts/AuthContext';

export const ViewPatient: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const patientId = parseInt(id || '0');

  const { user } = useAuth();                       
  const isDoctor = user?.role === 'doctor';
  let basePath;

  if (isDoctor)
    basePath = `/${user?.role}/patients`;
  else 
    basePath = `/${user?.role}`;

  const { data: patient, isLoading: isLoadingPatient } = usePatient(patientId);
  const { data: diseases, isLoading: isLoadingDiseases } = usePatientDiseases(patientId);

  const handleClose = () => navigate(basePath);
  const handleEdit  = () => navigate(`/dashboard/patients/edit/${id}`);
  const handleAssign = () => navigate(`/doctor/patients/assign-disease/${id}`);

  if (isLoadingPatient || isLoadingDiseases) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!patient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Patient Not Found</h2>
          <Button onClick={handleClose}>Back to Patients</Button>
        </div>
      </Layout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleClose}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        {isDoctor && (
          <Button onClick={handleAssign}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Disease
          </Button>
        )}
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Patient Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientDetails
            patient={patient}
            linkedDiseases={(diseases || []).map((d: any) => ({
              id:               d.id,
              disease_name:     d.disease_name,
              assigned_by_name: d.assigned_by_name,
              assigned_at:      d.assigned_at,
            }))}
            onClose={handleClose}
            onEdit={isDoctor ? handleEdit : undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};
