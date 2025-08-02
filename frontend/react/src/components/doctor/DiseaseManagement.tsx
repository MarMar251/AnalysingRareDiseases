// src/features/disease/pages/DiseaseManagement.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Plus, Search, Edit, Stethoscope, Eye } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useDiseases } from '../../features/diseases/hooks';
import type { Disease } from '../../entities';
import { useAuth } from "../../contexts/AuthContext";

export const DiseaseManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const limit = 10;
  const skip = page * limit;
  const { data: diseases = [], isLoading, isError } = useDiseases(skip, limit);

  const filteredDiseases = diseases.filter((d: Disease) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    toast({ variant: 'destructive', title: 'Error', description: 'Failed to load diseases.' });
    return <div>Error loading diseases</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Disease Management</h2>
          <p className="text-gray-600">Manage disease definitions and classifications</p>
        </div>
        <Button onClick={() => navigate(`/${user?.role}/diseases/create`)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Disease
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Diseases </CardTitle>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search diseases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDiseases.map((disease) => (
              <Card key={disease.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/${user?.role}/diseases/edit/${disease.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{disease.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {disease.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      ID: {disease.id}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/${user?.role}/diseases/view/${disease.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/${user?.role}/diseases/edit/${disease.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={diseases.length < limit}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};