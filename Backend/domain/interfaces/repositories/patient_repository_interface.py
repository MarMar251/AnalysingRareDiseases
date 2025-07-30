from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entities.patient import Patient
from domain.value_objects.date_of_birth import DateOfBirth
from domain.interfaces.repositories.base_repository import IRepository
from domain.value_objects.gender import Gender

class IPatientRepository(IRepository[Patient], ABC):

    @abstractmethod
    def create(
        self,
        *,
        full_name: str,
        birth_date: DateOfBirth,
        phone_number: str,
        gender: Gender,
        created_by: Optional[int] = None
    ) -> Patient:
        pass

    @abstractmethod
    def update(self, patient_id: int, updates: dict) -> Optional[Patient]:
        pass

    @abstractmethod
    def get_by_phone(self, phone_number: str) -> Optional[Patient]: 
        pass

    @abstractmethod
    def list_by_creator(self, creator_id: int) -> List[Patient]:
        pass

    