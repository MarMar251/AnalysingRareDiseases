import React from 'react';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { User as UserIcon, Mail, Shield } from 'lucide-react';
import { UserRole } from '../../entities';
import type { User } from '../../entities';

interface UserDetailsProps {
  user: User;
  onClose: () => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  onClose
}) => {
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case UserRole.DOCTOR:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case UserRole.NURSE:
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Can manage users, view all data, and configure system settings';
      case UserRole.DOCTOR:
        return 'Can manage patients, diseases, and perform AI analyses';
      case UserRole.NURSE:
        return 'Can view patient data and basic system information';
      default:
        return 'No description available';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-xl font-semibold">{user.full_name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p>{user.email}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">User Role</label>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Badge className={getRoleColor(user.role)} variant="outline">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {getRoleDescription(user.role)}
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <Badge variant="outline" className="mt-1">
                  #{user.id}
                </Badge>
              </div>
              
              <div className="text-right">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </div>
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