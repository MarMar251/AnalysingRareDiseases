import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { DiseaseDetails } from '../../components/details/DiseaseDetails';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useDisease } from '../../features/diseases/hooks';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../features/users/hooks';

export const ViewDisease: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: disease, isLoading, isError } = useDisease(id);

  const doctorId = disease?.created_by;
  const { data: doctor } = useUser(doctorId as number, !!doctorId);

  const handleClose = () => navigate(`/${user?.role}/diseases`);

  if (isLoading) return <Layout>Loading...</Layout>;
  if (isError || !disease) {
    return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Disease Not Found</h2>
          <Button onClick={() => navigate(`/${user?.role}/diseases`)}>
            Back to Diseases
          </Button>
        </div>
    );
  }

  const doctorName = doctor?.full_name

  return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${user?.role}/diseases`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Diseases
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Disease Details</CardTitle>
          </CardHeader>
          <CardContent>
            <DiseaseDetails
              disease={disease}
              onClose={handleClose}
              doctorName={doctorName}
            />
          </CardContent>
        </Card>
      </div>
  );
};
