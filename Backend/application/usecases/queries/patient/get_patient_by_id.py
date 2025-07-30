from dataclasses import dataclass

from domain.interfaces.unit_of_work import IUnitOfWork
from domain.entities.patient import Patient
from application.usecases.errors import PatientNotFoundError


@dataclass(slots=True)
class GetPatientByIdQuery:
    patient_id: int


def get_patient_by_id(q: GetPatientByIdQuery, *, uow: IUnitOfWork) -> Patient:
    patient = uow.patients.get_by_id(q.patient_id)
    if patient is None:
        raise PatientNotFoundError
    return patient
