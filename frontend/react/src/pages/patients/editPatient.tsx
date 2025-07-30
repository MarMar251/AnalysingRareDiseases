import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { PatientForm } from '../../components/forms/PatientForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { usePatient, useUpdatePatient } from '../../features/patients/hooks';
import type { Patient, NewPatient } from '../../entities';

export const EditPatient: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const patientId = parseInt(id || '0');

  const { data: patient, isLoading } = usePatient(patientId);
  const updatePatient = useUpdatePatient();
  const { toast } = useToast();

  const handleSubmit = (data: NewPatient) => {
    updatePatient.mutate(
      { id: patientId, data },
      {
        onSuccess: () => {
          toast({ title: "Patient updated", description: `${data.full_name} has been updated.` });
          navigate('/nurse');
        },
      }
    );
  };

  const handleCancel = () => navigate('/nurse');

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!patient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Patient Not Found</h2>
          <Button onClick={handleCancel}>Back to Patients</Button>
        </div>
      </Layout>
    );
  }

  return (
    <div className="space-y-6">

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm
            patient={patient}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>

  );
};
