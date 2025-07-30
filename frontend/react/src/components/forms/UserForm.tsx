import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card, CardHeader, CardContent, CardTitle
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../../components/ui/select";
import { DialogFooter } from "../../components/ui/dialog";
import { UserRole } from "../../entities";
import type { NewUser, UpdateUser } from "../../entities";

type BaseProps = {
  onCancel: () => void | Promise<void>;
};

type CreateProps = {
  user?: undefined;
  onSubmit: (data: NewUser) => void;
};

type EditProps = {
  user: Partial<UpdateUser> & { id: number };
  onSubmit: (data: UpdateUser) => void;
};

export type UserFormProps = BaseProps & (CreateProps | EditProps);

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
}) => {
  const isEdit = !!user?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewUser | UpdateUser>({
    defaultValues: {
      full_name: user?.full_name ?? "",
      email: user?.email ?? "",
      phone_number: user?.phone_number ?? "",
      password: "",
      role: user?.role ?? undefined,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        password: "",
        role: user.role,
      });
    }
  }, [user, reset]);

  const selectedRole = watch("role");

  const onFormSubmit = (data: any) => {
    // For edit mode, only include name, phone and password
    if (isEdit) {
      const editData: UpdateUser = {
        full_name: data.full_name,
        phone_number: data.phone_number,
        email: user?.email || "",
        role: user?.role || UserRole.NURSE
      };

      // Only include password if it was provided
      if (data.password && data.password.trim() !== "") {
        editData.password = data.password;
      }

      // Type assertion to fix type incompatibility with onSubmit
      (onSubmit as (data: UpdateUser) => void)(editData);
    } else {
      // Create mode - include all fields and ensure password is provided
      const newUserData: NewUser = {
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number,
        password: data.password,
        role: data.role
      };
      onSubmit(newUserData);
    }
  };

  return (
    <Card className="max-w-xl mx-auto border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit User" : "Add User"}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
          {/* Show all fields for create mode, but only name, phone and password for edit mode */}
          {!isEdit ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    {...register("full_name", { required: "Full name is required" })}
                  />
                  {errors.full_name && <p className="text-sm text-destructive">{errors.full_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    {...register("phone_number", { required: "Phone number is required" })}
                  />
                  {errors.phone_number && <p className="text-sm text-destructive">{errors.phone_number.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    placeholder="Enter password"
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={selectedRole || ""}
                  onValueChange={(value) => setValue("role", value as UserRole)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.DOCTOR}>Doctor</SelectItem>
                    <SelectItem value={UserRole.NURSE}>Nurse</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-destructive">Role is required</p>}
              </div>
            </>
          ) : (
            // Edit mode - only show name, phone and password fields
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    {...register("full_name", { required: "Full name is required" })}
                  />
                  {errors.full_name && <p className="text-sm text-destructive">{errors.full_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    {...register("phone_number", { required: "Phone number is required" })}
                  />
                  {errors.phone_number && <p className="text-sm text-destructive">{errors.phone_number.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="Leave blank to keep current password"
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </CardContent>
    </Card>
  );
};
