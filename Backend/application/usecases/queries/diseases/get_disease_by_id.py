from dataclasses import dataclass

from domain.interfaces.unit_of_work import IUnitOfWork
from domain.entities.disease import Disease
from application.usecases.errors import DiseaseNotFoundError


@dataclass(slots=True)
class GetDiseaseByIdQuery:
    disease_id: int


def get_disease_by_id(q: GetDiseaseByIdQuery, *, uow: IUnitOfWork) -> Disease:
    disease = uow.diseases.get_by_id(q.disease_id)
    if disease is None:
        raise DiseaseNotFoundError
    return disease
