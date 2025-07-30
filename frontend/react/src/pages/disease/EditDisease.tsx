import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { DiseaseForm } from '../../components/forms/DiseaseForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useDisease, useUpdateDiseaseDescription } from '../../features/diseases/hooks';
import type { Disease } from '../../entities';
import { useAuth } from '../../contexts/AuthContext';

export const EditDisease: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: disease, isLoading, isError } = useDisease(id);
  const updateMutation = useUpdateDiseaseDescription();

  if (isLoading) return <Layout>Loading...</Layout>;
  if (isError || !disease) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Disease Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The disease you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate(`/${user?.role}/diseases`)}>
              Go Back to Diseases
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = (data: Omit<Disease, 'id' | 'created_by'>) => {
    updateMutation.mutate(
      { id: disease.id, description: data.description ?? '' },
      {
        onSuccess: (updated) => {
          toast({
            title: 'Disease Updated',
            description: `${updated.name} has been successfully updated.`,
          });
          navigate(`/${user?.role}/diseases/view/${disease.id}`);
        },
        onError: (e: any) => {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: e?.message || 'Update failed',
          });
        },
      }
    );
  };

  const handleBack = () => navigate(`/${user?.role}/diseases/view/${disease.id}`);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Details
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Disease</CardTitle>
          <CardDescription>
            Update the disease description (name is read-only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DiseaseForm
            onSubmit={onSubmit}
            onCancel={handleBack}
            defaultValues={{
              name: disease.name,
              description: disease.description,
            }}
            submitLabel="Save Changes"
            readOnlyName // <-- prevent editing name
          />
        </CardContent>
      </Card>
    </div>
  );
};
