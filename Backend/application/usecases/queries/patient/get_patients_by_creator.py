# application/usecases/queries/patient/get_patients_by_creator.py
from dataclasses import dataclass
from typing import List
from domain.entities.patient import Patient
from domain.interfaces.unit_of_work import IUnitOfWork

@dataclass
class GetPatientsByCreatorQuery:
    creator_id: int

def get_patients_by_creator(query: GetPatientsByCreatorQuery, uow: IUnitOfWork) -> List[Patient]:
    with uow:
        patients = uow.patients.list_by_creator(query.creator_id)
        return patients
