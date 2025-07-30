# application/usecases/commands/diseases/add_disease.py
from dataclasses import dataclass
from typing import Optional

from domain.interfaces.unit_of_work import IUnitOfWork
from domain.entities.disease import Disease
from domain.value_objects.disease_create_vo import DiseaseCreateVO

from application.usecases.errors import DiseaseAlreadyExistsError


@dataclass(slots=True)
class AddDiseaseCommand:
    name: str
    doctor_id: int
    description: str

def add_disease(cmd: AddDiseaseCommand, uow: IUnitOfWork) -> Disease:
    with uow:
        existing = uow.diseases.get_by_name(cmd.name)
        if existing:
            raise DiseaseAlreadyExistsError()

        disease = uow.diseases.create(
            DiseaseCreateVO(
                name=cmd.name,
                doctor_id=cmd.doctor_id,
                description=cmd.description
            )
        )

        uow.commit()
        return disease
