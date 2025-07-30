# domain/entities/patient.py
from dataclasses import dataclass
from datetime import date
from typing import Optional
from domain.value_objects.gender import Gender
from domain.value_objects.date_of_birth import DateOfBirth

@dataclass(slots=True)
class Patient:
    id: Optional[int]
    full_name: str
    birth_date: DateOfBirth  
    phone_number: str
    gender: Gender
    created_by: Optional[int] = None
