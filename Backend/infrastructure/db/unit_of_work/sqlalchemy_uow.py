from contextlib import AbstractAsyncContextManager
from sqlalchemy.orm import Session

from domain.interfaces.unit_of_work import IUnitOfWork

from infrastructure.db.repositories.patient_repository import PatientRepository
from infrastructure.db.repositories.disease_repository import DiseaseRepository
from infrastructure.db.repositories.user_repository import UserRepository
from infrastructure.db.repositories.patient_disease_repository import PatientDiseaseRepository
from infrastructure.db.repositories.token_blacklist_repository import (
    TokenBlacklistRepository,
)
from infrastructure.db.repositories.classification_repository import ClassificationRepository

class SqlAlchemyUnitOfWork(IUnitOfWork, AbstractAsyncContextManager):
    """
    Concrete Unit-of-Work wrapping a SQLAlchemy Session
    and exposing all needed repositories (DB + JSON).
    """

    def __init__(self, db: Session):
        self._db = db

        # DB-backed repos
        self._patients = PatientRepository(db)
        self._diseases = DiseaseRepository(db)
        self._patient_diseases = PatientDiseaseRepository(db)
        self._users = UserRepository(db)
        self._token_blacklist = TokenBlacklistRepository(db)
        
        # ML-backed repos
        self._classification = ClassificationRepository()
        

    # ---------- interface properties ----------
    @property
    def patients(self): return self._patients

    @property
    def diseases(self): return self._diseases

    @property
    def patient_diseases(self): return self._patient_diseases

    @property
    def users(self): return self._users

    
    @property
    def token_blacklist(self) -> TokenBlacklistRepository:
        return self._token_blacklist
        
    @property
    def classification(self):
        return self._classification

    # ---------- transaction control ----------
    def commit(self): self._db.commit()

    def rollback(self): self._db.rollback()

    # ---------- sync context-manager ----------
    def __enter__(self):

        return self

    def __exit__(self, exc_type, exc, tb):
        if exc_type:
            self.rollback()
        else:
            self.commit()

    # ---------- async context-manager ----------
    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        if exc_type:
            self.rollback()
        else:
            self.commit()