import React from 'react';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { User, Calendar, Phone, Users } from 'lucide-react';
import { GenderEnum } from '../../entities';
import type { Patient } from '../../entities';
import { useAuth } from '../../contexts/AuthContext';

interface PatientDetailsProps {
  patient: Patient;
  linkedDiseases: {
    id: number;
    disease_name: string;
    assigned_by_name?: string;
    assigned_at?: string;
  }[];
  onClose: () => void;
  onEdit?: () => void;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({
  patient,
  linkedDiseases,
  onClose,
  onEdit,
}) => {
  const { user } = useAuth();
  const isNurse = user?.role === "nurse";

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Patient Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <p className="text-lg font-semibold">{patient.full_name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Age
              </label>
              <p className="text-lg">{calculateAge(patient.birth_date)} years old</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Birth Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p>{formatDate(patient.birth_date)}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Gender
              </label>
              <Badge variant="outline" className="mt-1 capitalize">
                {patient.gender ?? "Not specified"}
              </Badge>
            </div>
          </div>

          {patient.phone_number && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p>{patient.phone_number}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Linked Diseases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Diagnosed Diseases ({linkedDiseases.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {linkedDiseases.length > 0 ? (
            <div className="space-y-4">
              {linkedDiseases.map((disease) => (
                <div
                  key={disease.id}
                  className="border rounded-lg p-3 bg-muted/20 space-y-1"
                >
                  <Badge variant="secondary" className="px-3 py-1 text-base">
                    {disease.disease_name}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Assigned by:{" "}
                    <span className="font-medium">
                      {disease.assigned_by_name ?? "Unknown"}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date:{" "}
                    {disease.assigned_at
                      ? new Date(disease.assigned_at).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No diseases diagnosed for this patient.
            </p>
          )}
        </CardContent>
      </Card>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </div>
  );
};
