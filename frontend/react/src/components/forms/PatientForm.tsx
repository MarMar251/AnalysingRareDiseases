import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { DialogFooter } from "../../components/ui/dialog";
import { GenderEnum, type Patient } from "../../entities";
import { useDoctors, useUsers } from "../../features/users/hooks";
import { useAuth } from "../../contexts/AuthContext";

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: Omit<Patient, "id">) => void;
  onCancel: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  onSubmit,
  onCancel,
}) => {
  const { user } = useAuth();
  const isNurse = user?.role === "nurse";

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Patient, "id">>({
    defaultValues: {
      full_name: patient?.full_name ?? "",
      birth_date: patient?.birth_date ?? "",
      phone_number: patient?.phone_number ?? "",
      gender: patient?.gender ?? GenderEnum.MALE,
      created_by: patient?.created_by ?? undefined,
    },
  });

  const { data: doctorOptions = [] } = useDoctors();

  const onFormSubmit = (data: Omit<Patient, "id">) => {
    // If editing, only include name, phone number, and birth date
    if (patient) {
      const editData = {
        full_name: data.full_name,
        phone_number: data.phone_number,
        birth_date: data.birth_date,
        gender: patient.gender,  // Keep original value
        created_by: patient.created_by  // Keep original value
      };
      onSubmit(editData);
    } else {
      // Create mode - include all fields
      onSubmit(data);
    }
  };

  return (
    <Card className="max-w-xl mx-auto shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle>{patient ? "Edit Patient" : "Add Patient"}</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Show all fields for new patients, but only name, phone and birthdate for editing */}
          {!patient ? (
            <>
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    {...register("full_name", {
                      required: "Full name is required",
                    })}
                    placeholder="Enter patient's full name"
                  />
                  {errors.full_name && (
                    <p className="text-sm text-destructive">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    {...register("phone_number")}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Birth Date */}
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Birth Date</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    {...register("birth_date", {
                      required: "Birth date is required",
                    })}
                  />
                  {errors.birth_date && (
                    <p className="text-sm text-destructive">
                      {errors.birth_date.message}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={GenderEnum.MALE} className="capitalize">
                            Male
                          </SelectItem>
                          <SelectItem value={GenderEnum.FEMALE} className="capitalize">
                            Female
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {isNurse && (
                <div className="space-y-2">
                  <Label htmlFor="created_by">Assign to Doctor</Label>
                  <Controller
                    control={control}
                    name="created_by"
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() ?? ""}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger id="created_by">
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctorOptions.map((doc) => (
                            <SelectItem key={doc.id} value={doc.id.toString()}>
                              {doc.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}
            </>
          ) : (
            // Edit mode - only show name, phone number and birth date
            <>
              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    {...register("full_name", {
                      required: "Full name is required",
                    })}
                    placeholder="Enter patient's full name"
                  />
                  {errors.full_name && (
                    <p className="text-sm text-destructive">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    {...register("phone_number")}
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Birth Date</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    {...register("birth_date", {
                      required: "Birth date is required",
                    })}
                  />
                  {errors.birth_date && (
                    <p className="text-sm text-destructive">
                      {errors.birth_date.message}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {patient ? "Update Patient" : "Create Patient"}
            </Button>
          </DialogFooter>
        </form>
      </CardContent>
    </Card>
  );
};
