# application/usecases/commands/patients/delete_patient.py
from domain.interfaces.unit_of_work import IUnitOfWork
from application.usecases.errors import PatientNotFoundError


def delete_patient(uow: IUnitOfWork, patient_id: int) -> None:
    if not uow.patients.get_by_id(patient_id):
        raise PatientNotFoundError
    uow.patients.delete(patient_id)
    uow.commit()
