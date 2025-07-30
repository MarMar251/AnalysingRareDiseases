from typing import Optional
from dataclasses import dataclass

from domain.interfaces.unit_of_work import IUnitOfWork
from domain.entities.patient_disease import PatientDisease


@dataclass(slots=True)
class GetPatientDiseaseQuery:
    patient_id: int
    disease_id: int


def get_by_patient_and_disease(
    q: GetPatientDiseaseQuery, *, uow: IUnitOfWork
) -> Optional[PatientDisease]:

    return uow.patient_diseases.get_by_patient_and_disease(
        q.patient_id, q.disease_id
    )
