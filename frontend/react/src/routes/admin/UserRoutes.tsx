import React from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { UserForm } from "../../components/forms/UserForm";
import { useCreateUser, useUpdateUser, useUser } from "../../features/users/hooks";
import { toast } from "../../hooks/use-toast";
import type { NewUser, UpdateUser } from "../../entities";
import { UserManagement } from "../../components/admin/UserManagement";

/* ── Add ── */
const AddUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: create } = useCreateUser();

  const handleSubmit = (data: NewUser) => {
    create(data, {
      onSuccess: () => {
        toast({ title: "User created" });
        navigate("/admin/users");
      },
    });
  };

  return <UserForm onSubmit={handleSubmit} onCancel={() => navigate("/admin/users")} />;
};

/* ── Edit ── */
const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const { data: user, isLoading } = useUser(userId, Boolean(id));
  const { mutate: update } = useUpdateUser();
  const navigate = useNavigate();

  if (isLoading) return <p className="p-6">Loading…</p>;
  if (!user) return <Navigate to="/admin/users" replace />;

  const handleSubmit = (data: UpdateUser) => {
    update(
      { id: user.id, data },
      {
        onSuccess: () => {
          toast({ title: "User updated" });
          navigate("/admin/users");
        },
      }
    );
  };

  return (
    <UserForm
      user={user}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/users")}
    />
  );
};

/* ── Routes ── */
const UserRoutes: React.FC = () => (
  <Routes>
    <Route index element={<UserManagement />} />
    <Route path="new" element={<AddUserPage />} />
    <Route path=":id/edit" element={<EditUserPage />} />
  </Routes>
);

export default UserRoutes;
