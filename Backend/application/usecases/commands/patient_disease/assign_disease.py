from dataclasses import dataclass

from domain.interfaces.unit_of_work import IUnitOfWork
from application.usecases.errors import PatientNotFoundError, PatientDiseaseLinkExistsError, DiseaseNotFoundError

from domain.entities.patient_disease import PatientDisease


@dataclass(slots=True)
class AssignDiseaseCommand:
    patient_id: int
    disease_id: int
    doctor_id: int


def assign_disease_to_patient(
    cmd: AssignDiseaseCommand,
    uow: IUnitOfWork,
) -> PatientDisease:
    if not uow.patients.get_by_id(cmd.patient_id):
        raise PatientNotFoundError
    if not uow.diseases.get_by_id(cmd.disease_id):
        raise DiseaseNotFoundError
    if uow.patient_diseases.get_by_patient_and_disease(cmd.patient_id, cmd.disease_id):
        raise PatientDiseaseLinkExistsError

    link = uow.patient_diseases.assign(
        patient_id=cmd.patient_id,
        disease_id=cmd.disease_id,
        doctor_id=cmd.doctor_id,
    )
    uow.commit()
    return link
