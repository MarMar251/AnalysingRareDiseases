from typing import List
from domain.interfaces.unit_of_work import IUnitOfWork
from domain.entities.patient import Patient

def get_all_patients(uow: IUnitOfWork) -> List[Patient]:
    return uow.patients.list_all()
