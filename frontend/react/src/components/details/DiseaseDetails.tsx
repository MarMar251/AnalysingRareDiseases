import React from 'react';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Stethoscope, User as UserIcon } from 'lucide-react';
import type { Disease } from '../../entities';

interface DiseaseDetailsProps {
  disease: Disease;
  onClose: () => void;
  doctorName?: string; 
}

export const DiseaseDetails: React.FC<DiseaseDetailsProps> = ({
  disease,
  onClose,
  doctorName,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Disease Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Disease Name</label>
            <p className="text-xl font-semibold">{disease.name}</p>
          </div>

          {disease.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {disease.description}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Disease ID</label>
              <Badge variant="outline" className="mt-1">#{disease.id}</Badge>
            </div>

            <div>
              <div className="flex items-center gap-2 mt-1">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </DialogFooter>
    </div>
  );
};