from __future__ import annotations

from datetime import date
from enum import Enum
from typing import Optional, TYPE_CHECKING
from domain.value_objects.gender import Gender
from pydantic import BaseModel, field_validator

if TYPE_CHECKING:
    from domain.entities.patient import Patient


# ─────────────  INPUT DTOs  ───────────────────────────────────────────────
class PatientCreate(BaseModel):
    full_name: str
    phone_number: str
    birth_date: date
    gender: Gender  
    created_by: Optional[int] = None

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    birth_date: Optional[date] = None

    @field_validator("birth_date", mode="before")
    @classmethod
    def normalize_date(cls, v):
        if v is None:
            return v
        if isinstance(v, str):
            parts = v.split("-")
            if len(parts) == 3:
                # year stays as-is, month/day padded to 2 digits
                y, m, d = parts
                m = m.zfill(2)
                d = d.zfill(2)
                v = f"{y}-{m}-{d}"
        return v

# ─────────────  OUTPUT DTO  ───────────────────────────────────────────────
class PatientOut(BaseModel):
    id: int
    full_name: str
    phone_number: str
    birth_date: date
    gender: Gender
    created_by: Optional[int]

    @classmethod
    def from_entity(cls, patient: Patient) -> "PatientOut":
        return cls(
            id=patient.id,
            full_name=patient.full_name,
            phone_number=patient.phone_number,
            birth_date=patient.birth_date,
            gender=patient.gender,
            created_by=patient.created_by
        )
    model_config = {"from_attributes": True}
