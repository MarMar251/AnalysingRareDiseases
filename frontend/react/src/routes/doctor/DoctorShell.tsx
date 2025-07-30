import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../entities';

const tabs = [
  { to: '/doctor', label: 'Overview' },
  { to: '/doctor/patients', label: 'Patients' },
  { to: '/doctor/diseases', label: 'Diseases' },
  { to: '/doctor/ai', label: 'AI Analysis' },
];

export const DoctorShell: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated or not a doctor
    if (!user) {
      navigate('/login');
    } else if (user.role !== UserRole.DOCTOR) {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  return (
    <Layout>
      {/* Tabs Navigation */}
      <div className="border-b mb-6">
        <nav className="flex space-x-6 px-4">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.to === '/doctor'}
              className={({ isActive }) =>
                [
                  'py-3 text-sm font-medium border-b-2',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                ].join(' ')
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet />
    </Layout>
  );
};
