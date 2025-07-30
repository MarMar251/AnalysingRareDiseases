# domain/usecases/patient_disease/list_patient_diseases_detailed.py

from typing import List

from domain.interfaces.unit_of_work import IUnitOfWork
from presentation.schemas.patient_disease import AssignedDiseaseDetailsOut


class ListPatientDiseasesDetailed:

    def __init__(self, uow: IUnitOfWork):
        self.uow = uow

    def execute(self, patient_id: int) -> List[AssignedDiseaseDetailsOut]:
        with self.uow:
            links = self.uow.patient_diseases.get_details_by_patient_id(patient_id)
            return [AssignedDiseaseDetailsOut.from_entity(link) for link in links]
