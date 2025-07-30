from typing import Sequence
from dataclasses import dataclass

from domain.interfaces.unit_of_work import IUnitOfWork


@dataclass(slots=True)
class GetDiseasesByPatientQuery:
    patient_id: int


def get_diseases_by_patient_id(
    q: GetDiseasesByPatientQuery, *, uow: IUnitOfWork
) -> Sequence[str]:
    return uow.patient_diseases.get_disease_names_by_patient_id(q.patient_id)
