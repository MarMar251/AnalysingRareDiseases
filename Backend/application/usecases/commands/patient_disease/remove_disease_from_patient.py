from domain.interfaces.unit_of_work import IUnitOfWork
from application.usecases.errors import PatientDiseaseLinkNotFoundError


def remove_disease_from_patient(uow: IUnitOfWork, link_id: int) -> None:
    if not uow.patient_diseases.get_by_id(link_id):
        raise PatientDiseaseLinkNotFoundError
    uow.patient_diseases.delete(link_id)
    uow.commit()
