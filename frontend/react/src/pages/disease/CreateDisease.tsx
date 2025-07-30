import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { DiseaseForm } from '../../components/forms/DiseaseForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useCreateDisease } from '../../features/diseases/hooks';
import type { Disease } from '../../entities';
import { useAuth } from "../../contexts/AuthContext";

export const CreateDisease: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createMutation = useCreateDisease();

  const handleSubmit = (data: Omit<Disease, 'id' | 'created_by'>) => {
    createMutation.mutate(data, {
      onSuccess: (res) => {
        toast({
          title: 'Disease created',
          description: `${res.name} has been added to the database.`,
        });
        navigate(`/${user?.role}/diseases`);
      },
      onError: (e: any) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: e?.message || 'Failed to create disease',
        });
      },
    });
  };

  const handleCancel = () => {
    navigate(`/${user?.role}/diseases`);
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/${user?.role}/diseases`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Diseases
          </Button>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Disease</CardTitle>
          </CardHeader>
          <CardContent>
            <DiseaseForm onSubmit={handleSubmit} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
  );
};