import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Users, UserPlus, Activity } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useUsers } from '../../features/users/hooks';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* -------- fetch users for real-time count -------- */
  const {
    data: users = [],
    isLoading,
    isError,
  } = useUsers(); 

  /* -------- memoized total to avoid unnecessary recalculations -------- */
  const totalUsers = useMemo(() => users.length, [users]);

  if (isLoading) return <p>Loading users…</p>;
  if (isError) return <p className="text-red-500">Failed to load users.</p>;

  return (
    <div className="space-y-6">
      {/* ---- top bar ---- */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <Button
            variant={location.pathname.includes('/admin/overview') ? 'default' : 'outline'}
            onClick={() => navigate('/admin/overview')}
          >
            Overview
          </Button>
          <Button
            variant={location.pathname.includes('/admin/users') ? 'default' : 'outline'}
            onClick={() => navigate('/admin/users')}
          >
            Users
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* ---- User Management card ---- */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/admin/users')}
          onKeyUp={(e) => e.key === 'Enter' && navigate('/admin/users')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Management</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Total system users</p>
            <Button className="mt-4 w-full" variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </CardContent>
        </Card>

        {/* ---- System Health card ---- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Database</span>
                <span className="text-green-600">Online</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>API Service</span>
                <span className="text-green-600">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
