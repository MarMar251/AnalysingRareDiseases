# domain/entities/disease.py
from dataclasses import dataclass

@dataclass(slots=True)
class Disease:
    id: int | None
    name: str
    created_by: int
    description: str
