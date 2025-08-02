import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { usePatient } from '../../features/patients/hooks';
import { useDiseases } from '../../features/diseases/hooks';
import { useAssignDisease } from '../../features/patient-diseases/hooks';

export const AssignDisease: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const patientId = parseInt(id || '0');
  const { toast } = useToast();

  const { data: patient, isLoading: loadingPatient } = usePatient(patientId);
  // Fetch all diseases by setting a very large limit
  const { data: diseases, isLoading: loadingDiseases } = useDiseases(0, 10000);
  const assignDisease = useAssignDisease();

  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState('');

  const filteredDiseases = (diseases || []).filter((disease) =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignDisease = () => {
    if (!selectedDiseaseId) {
      toast({ title: 'Error', description: 'Please select a disease to assign.', variant: 'destructive' });
      return;
    }

    assignDisease.mutate({
      patient_id: patientId,
      disease_id: parseInt(selectedDiseaseId),
    }, {
      onSuccess: () => {
        const selected = diseases?.find(d => d.id === parseInt(selectedDiseaseId));
        toast({
          title: 'Disease Assigned',
          description: `${selected?.name} has been assigned to ${patient?.full_name}.`
        });
        navigate(`/doctor/patients/view/${id}`);
      },
      onError: () => {
        toast({ title: 'Error', description: 'Assignment failed.', variant: 'destructive' });
      }
    });
  };

  if (loadingPatient || loadingDiseases) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!patient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Not Found</h2>
          <Button onClick={() => navigate(`/doctor/patients/view/${id}`)}>Back to Patients</Button>
        </div>
      </Layout>
    );
  }

  return (
    <div className="space-y-6">

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Assign Disease to Patient</CardTitle>
          <div className="text-muted-foreground">
            Patient: <span className="font-medium">{patient.full_name}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Search Diseases</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for diseases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Available Diseases</label>
              <div className="max-h-60 overflow-y-auto border rounded-lg p-4 space-y-2">
                {filteredDiseases.map((disease) => (
                  <div
                    key={disease.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedDiseaseId === disease.id.toString()
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => setSelectedDiseaseId(disease.id.toString())}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{disease.name}</h4>

                      </div>
                      <input
                        type="radio"
                        name="disease"
                        value={disease.id}
                        checked={selectedDiseaseId === disease.id.toString()}
                        onChange={() => setSelectedDiseaseId(disease.id.toString())}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => navigate(`/doctor/patients/view/${id}`)}>Cancel</Button>
            <Button onClick={handleAssignDisease} disabled={!selectedDiseaseId}>
              <Plus className="h-4 w-4 mr-2" /> Assign Disease
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

  );
};
