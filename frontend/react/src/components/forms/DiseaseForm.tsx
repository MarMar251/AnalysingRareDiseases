// src/components/forms/DiseaseForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { DialogFooter } from '../../components/ui/dialog';
import type { Disease } from '../../entities';

type FormData = Omit<Disease, 'id' | 'created_by'>;

interface DiseaseFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void | Promise<void>;
  defaultValues?: Partial<FormData>;
  submitLabel?: string;
  readOnlyName?: boolean;
}

export const DiseaseForm: React.FC<DiseaseFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  submitLabel = 'Create Disease',
  readOnlyName = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ defaultValues });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Disease Name</Label>
        {readOnlyName ? (
          <>
            <p className="text-lg font-semibold">{defaultValues?.name}</p>
            {/* keep the value in form submission */}
            <input type="hidden" {...register('name')} />
          </>
        ) : (
          <>
            <Input
              id="name"
              {...register('name', { required: 'Disease name is required' })}
              placeholder="Enter disease name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter disease description"
          rows={4}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </DialogFooter>
    </form>
  );
};
