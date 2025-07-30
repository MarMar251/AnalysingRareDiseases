from __future__ import annotations

from typing import Optional, Dict, Any, Sequence
from sqlalchemy.orm import Session

from domain.entities.patient import Patient
from domain.value_objects.gender import Gender
from domain.interfaces.repositories.patient_repository_interface import IPatientRepository
from domain.value_objects.date_of_birth import DateOfBirth

from infrastructure.db.models.patient import Patient as ORMPatient
from infrastructure.db.repositories._mapping import orm_to_entity
from sqlalchemy import select

class PatientRepository(IPatientRepository):
    def __init__(self, db: Session) -> None:
        self._db = db

    def create(
        self,
        *,
        full_name: str,
        birth_date: DateOfBirth,
        phone_number: str,
        gender: Gender,
        created_by: Optional[int] = None 
    ) -> Patient:
        orm_obj = ORMPatient(
            full_name=full_name,
            phone_number=phone_number,
            birth_date=birth_date.value,
            gender=gender.value,
            created_by=created_by,
        )
        self._db.add(orm_obj)
        self._db.flush()
        return orm_to_entity(orm_obj, Patient)

    def update(self, patient_id: int, updates: Dict[str, Any]) -> Optional[Patient]:
        obj = self._db.get(ORMPatient, patient_id)
        if obj is None:
            return None
        for k, v in updates.items():
            setattr(obj, k, v)
        self._db.flush()
        return orm_to_entity(obj, Patient)

    def delete(self, id: int) -> None:
        obj = self._db.get(ORMPatient, id)
        if obj:
            self._db.delete(obj)

    def get_by_id(self, id: int) -> Optional[Patient]:
        obj = self._db.get(ORMPatient, id)
        return orm_to_entity(obj, Patient) if obj else None

    def list(self, skip: int = 0, limit: int = 10) -> Sequence[Patient]:
        rows = self._db.query(ORMPatient).offset(skip).limit(limit).all()
        return [orm_to_entity(r, Patient) for r in rows]

    def list_all(self) -> Sequence[Patient]:
        rows = self._db.query(ORMPatient).all()
        return [orm_to_entity(r, Patient) for r in rows]

    def get_by_phone(self, phone_number: str) -> Optional[Patient]:
        stmt = select(ORMPatient).where(ORMPatient.phone_number == phone_number)
        result = self._db.execute(stmt).scalar_one_or_none()
        return orm_to_entity(result, Patient) if result else None
    
    def list_by_creator(self, creator_id: int, skip: int = 0, limit: int = 10) -> Sequence[Patient]:
        rows = (
            self._db.query(ORMPatient)
            .filter(ORMPatient.created_by == creator_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        return [orm_to_entity(r, Patient) for r in rows]