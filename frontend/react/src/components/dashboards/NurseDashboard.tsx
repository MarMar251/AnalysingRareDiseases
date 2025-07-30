// NurseDashboard.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users, FileText, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { usePatients } from '../../features/patients/hooks';
import { PatientManagement } from '../doctor/PatientManagement';

export const NurseDashboard: React.FC = () => {
  const { data: patients = [], isLoading } = usePatients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Nurse Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search patients..." className="pl-10 w-64" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Today</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : patients.length}</div>
            <p className="text-xs text-muted-foreground">Total patients listed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : patients.length}</div>
            <p className="text-xs text-muted-foreground">Total patient records</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>
            View, add, edit, and delete patient information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientManagement />
        </CardContent>
      </Card>
    </div>
  );
};
