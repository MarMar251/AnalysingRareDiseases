# presentation/schemas/patient_disease.py
from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from pydantic import BaseModel, Field

if TYPE_CHECKING:
    from domain.entities.patient_disease import PatientDisease


# -----------------------------  INPUT DTO  --------------------------------
class AssignDiseaseInput(BaseModel):
    """Body payload used by the /assign endpoint"""
    patient_id: int = Field(..., example=1)
    disease_id: int = Field(..., example=3)


# -----------------------------  OUTPUT DTOs -------------------------------
class AssignedDiseaseOut(BaseModel):
    id: int
    patient_id: int
    disease_id: int
    doctor_id: int         
    assigned_at: datetime

    @classmethod
    def from_entity(cls, link: "PatientDisease") -> "AssignedDiseaseOut":
        return cls(
            id=link.id,
            patient_id=link.patient_id,
            disease_id=link.disease_id,
            doctor_id=link.assigned_by,
            assigned_at=link.assigned_at,
        )


class PatientDiseaseOut(AssignedDiseaseOut):
    """Alias kept for possible future list views"""
    pass


class AssignedDiseaseDetailsOut(BaseModel):
    id: int
    disease_name: str
    assigned_by_name: str
    assigned_at: datetime

    @classmethod
    def from_entity(cls, link: "PatientDisease") -> "AssignedDiseaseDetailsOut":
        return cls(
            id=link.id,
            disease_name=link.disease.name if link.disease else "Unknown",
            assigned_by_name=link.doctor.full_name if link.doctor else "Unknown",
            assigned_at=link.assigned_at,
        )

