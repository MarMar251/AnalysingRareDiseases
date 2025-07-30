from abc import ABC, abstractmethod
from typing import Optional, Sequence
from domain.entities.patient_disease import PatientDisease
from domain.interfaces.repositories.base_repository import IRepository

class IPatientDiseaseRepository(IRepository[PatientDisease], ABC):

    @abstractmethod
    def assign(self, *, patient_id: int, disease_id: int, doctor_id: int) -> PatientDisease:
        pass

    @abstractmethod
    def get_by_patient_and_disease(self, patient_id: int, disease_id: int) -> Optional[PatientDisease]:
        pass

    @abstractmethod
    def get_disease_names_by_patient_id(self, patient_id: int) -> Sequence[str]:
        pass

    @abstractmethod
    def get_details_by_patient_id(self, patient_id: int) -> Sequence[PatientDisease]:
        pass


