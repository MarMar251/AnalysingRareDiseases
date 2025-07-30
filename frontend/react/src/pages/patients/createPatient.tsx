import React from "react";
import { useNavigate } from "react-router-dom";
import { PatientForm } from "../../components/forms/PatientForm";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Patient } from "../../entities";
import { useToast } from "../../hooks/use-toast";
import { useCreatePatient } from "../../features/patients/hooks";

export const CreatePatient: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: createPatient } = useCreatePatient();
  const handleSubmit = (data: Omit<Patient, "id">) => {
    createPatient(data, {
      onSuccess: (saved) => {
        toast({
          title: "Patient created",
          description: saved.full_name + " has been added.",
        });
        navigate("/nurse");
      },
    });
  };

  const handleCancel = () => navigate("/nurse");

  return (
    <div className="space-y-6">

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
};
