import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { UserForm } from '../../components/forms/UserForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { NewUser } from '../../entities';
import { useToast } from '../../hooks/use-toast';

export const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

    const handleSubmit = (data: NewUser) => {
    toast({
        title: "User created",
        description: `${data.full_name} has been added to the system.`,
    });
    navigate('/dashboard/users');
    };
  const handleCancel = () => {
    navigate('/dashboard/users');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm onSubmit={handleSubmit} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};