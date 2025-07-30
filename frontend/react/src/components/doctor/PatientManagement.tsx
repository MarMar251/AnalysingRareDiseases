import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Plus, Search, Edit, Trash2, User, Stethoscope } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { GenderEnum, type Patient } from "../../entities";
import {
  usePatients,
  useDeletePatient,
} from "../../features/patients/hooks";
import { toast } from "../../hooks/use-toast";

import { useAuth } from "../../contexts/AuthContext";

export const PatientManagement: React.FC = () => {
  const { user } = useAuth();
  const allowEdit = user?.role === "nurse";
  const isDoctor = user?.role === "doctor";

  const { data: patients = [], isLoading } = usePatients();
  const { mutate: remove } = useDeletePatient();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone_number ?? "").includes(searchTerm),
  );

  const age = (iso: string) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const handleDelete = (id: number) =>
    remove(id, {
      onSuccess: () =>
        toast({ title: "Patient deleted", description: `ID ${id} removed` }),
      onError: () =>
        toast({
          title: "Error",
          description: "Could not delete patient",
          variant: "destructive",
        }),
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Patient Management
          </h2>
          <p className="text-gray-600">Manage your patient records</p>
        </div>

        {allowEdit && (
          <Link to={isDoctor ? "/doctor/patients/new" : "/nurse/patients/new"}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Patient
            </Button>
          </Link>
        )}
      </div>

      {/* Directory card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Patient Directory</CardTitle>
              <CardDescription>
                {isLoading ? "Loading…" : `${filtered.length} patients found`}
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p className="p-4 text-sm text-gray-500">Fetching patients…</p>
          ) : (
            <div className="space-y-4">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Patient info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {p.full_name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Age: {age(p.birth_date)}</span>
                        <span>•</span>
                        <span>{p.phone_number}</span>
                        <span>•</span>
                        <Badge variant="outline" className="capitalize">
                          {p.gender ?? GenderEnum.MALE}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {/* Common action: View diseases */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(isDoctor ? `/doctor/patients/view/${p.id}` : `/nurse/patients/view/${p.id}`)}
                    >
                      <Stethoscope className="h-4 w-4 mr-1" />
                      Diseases
                    </Button>

                    {allowEdit && (
                      <Link to={`/nurse/patients/${p.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    )}

                    {allowEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
