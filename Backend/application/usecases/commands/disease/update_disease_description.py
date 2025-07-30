# application/usecases/commands/disease/update_disease_description.py
from dataclasses import dataclass

from domain.interfaces.unit_of_work import IUnitOfWork
from domain.entities.disease import Disease
from application.usecases.errors import DiseaseNotFoundError


@dataclass(slots=True)
class UpdateDiseaseDescriptionCommand:
    disease_id: int
    new_description: str


def update_disease_description(cmd: UpdateDiseaseDescriptionCommand, uow: IUnitOfWork) -> Disease:
    with uow:
        disease = uow.diseases.get_by_id(cmd.disease_id)
        if disease is None:
            raise DiseaseNotFoundError()

        updated = uow.diseases.update_description(cmd.disease_id, cmd.new_description)
        if updated is None:
            raise DiseaseNotFoundError()

        uow.commit()
        return updated

