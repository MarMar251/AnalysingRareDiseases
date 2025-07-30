# domain/entities/patient_disease.py
from dataclasses import dataclass
from typing import Optional, Any

@dataclass(slots=True)
class PatientDisease:
    id: int | None
    patient_id: int
    disease_id: int
    assigned_by: int  # doctor_id
    assigned_at: str  # ISO timestamp

    disease: Optional[Any] = None
    doctor: Optional[Any] = None