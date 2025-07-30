import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { UserForm } from '../../components/forms/UserForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useUser, useUpdateUser } from '../../features/users/hooks';
import { useToast } from '../../hooks/use-toast';
import type { UpdateUser } from '../../entities';

export const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0');
  const { data: user, isLoading } = useUser(userId);
  const { mutate: updateUser } = useUpdateUser();
  const { toast } = useToast();

    const handleSubmit = (data: UpdateUser) => {
    updateUser(
        { id: userId, data },
        {
        onSuccess: () => {
            toast({
            title: "User updated",
            description: `${data.full_name} has been updated successfully.`,
            });
            navigate('/dashboard/users');
        }
        }
    );
    };
  const handleCancel = () => {
    navigate('/dashboard/users');
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
          <Button onClick={handleCancel}>
            Back to Users
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit User</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm user={user} onSubmit={handleSubmit} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
