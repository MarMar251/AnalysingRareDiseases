from abc import ABC, abstractmethod
from domain.interfaces.repositories.patient_repository_interface import IPatientRepository
from domain.interfaces.repositories.disease_repository_interface import IDiseaseRepository
from domain.interfaces.repositories.patient_disease_repository_interface import IPatientDiseaseRepository
from domain.interfaces.repositories.user_repository_interface import IUserRepository
from domain.interfaces.repositories.classification_repository_interface import IClassificationRepository
from typing import Optional, Any
from domain.interfaces.repositories.token_blacklist_repository import (
    ITokenBlacklistRepository,
)
# -----------------------------------------------------
# Interface: IUnitOfWork
# Purpose: Manage transaction + access to all repositories
# Design Pattern: Unit of Work
# -----------------------------------------------------
class IUnitOfWork(ABC):
    @abstractmethod
    def commit(self) -> None:
        """
        Commit the current transaction.
        """
        pass

    @abstractmethod
    def rollback(self) -> None:
        """
        Rollback the current transaction.
        """
        pass

    @property
    @abstractmethod
    def patients(self) -> IPatientRepository:
        pass

    @property
    @abstractmethod
    def diseases(self) -> IDiseaseRepository:
        pass

    @property
    @abstractmethod
    def patient_diseases(self) -> IPatientDiseaseRepository:
        pass

    @property
    @abstractmethod
    def users(self) -> IUserRepository:
        pass

    @property 
    @abstractmethod
    def token_blacklist(self) -> ITokenBlacklistRepository: ...
    
    @property
    @abstractmethod
    def classification(self) -> IClassificationRepository: ...

    # ---------- sync context-manager ----------
    @abstractmethod
    def __enter__(self) -> "IUnitOfWork": ...
    @abstractmethod
    def __exit__(self, exc_type: Optional[type[BaseException]],
                 exc: Optional[BaseException],
                 tb: Optional[Any]) -> None: ...

    # ---------- async context-manager ----------
    async def __aenter__(self):  
        return self
    async def __aexit__(self, exc_type, exc, tb):
        self.__exit__(exc_type, exc, tb)