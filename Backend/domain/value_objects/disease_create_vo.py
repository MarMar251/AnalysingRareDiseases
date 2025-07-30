# domain/value_objects/disease_create_vo.py
from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class DiseaseCreateVO:
    name: str
    doctor_id: int
    description: str
