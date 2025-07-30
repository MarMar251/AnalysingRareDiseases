# infrastructure/db/repositories/disease_repository.py
from __future__ import annotations

from typing import Optional, Sequence

from sqlalchemy.orm import Session

from domain.entities.disease import Disease
from domain.interfaces.repositories.disease_repository_interface import (
    IDiseaseRepository,
)
from domain.value_objects.disease_create_vo import DiseaseCreateVO

from infrastructure.db.models.disease import Disease as ORMDisease
from infrastructure.db.repositories._mapping import orm_to_entity


class DiseaseRepository(IDiseaseRepository):

    # --------------------------------------------------------------------- #
    # constructor
    # --------------------------------------------------------------------- #
    def __init__(self, db: Session) -> None:
        self._db = db

    # --------------------------------------------------------------------- #
    # Commands
    # --------------------------------------------------------------------- #
    def create(self, payload: DiseaseCreateVO) -> Disease:
        orm_obj = ORMDisease(name=payload.name, doctor_id=payload.doctor_id,  description=payload.description)
        self._db.add(orm_obj)
        self._db.flush()                       
        return orm_to_entity(orm_obj, Disease)

    def delete(self, id: int) -> None:
        orm_obj = self._db.query(ORMDisease).get(id)  
        if orm_obj:
            self._db.delete(orm_obj)
    
    def update_description(self, id: int, description: str) -> Optional[Disease]:
        orm_obj = self._db.query(ORMDisease).get(id) 
        if orm_obj is None:
            return None
        orm_obj.description = description
        self._db.flush()
        return orm_to_entity(orm_obj, Disease)

    # --------------------------------------------------------------------- #
    # Queries
    # --------------------------------------------------------------------- #
    def get_by_id(self, id: int) -> Optional[Disease]:
        orm_obj = self._db.query(ORMDisease).get(id) 
        return orm_to_entity(orm_obj, Disease) if orm_obj else None

    def get_by_name(self, name: str) -> Optional[Disease]:
        orm_obj = (
            self._db.query(ORMDisease)
            .filter(ORMDisease.name.ilike(name))
            .first()
        )
        return orm_to_entity(orm_obj, Disease) if orm_obj else None

    def list(self, skip: int = 0, limit: int = 10) -> Sequence[Disease]:

        rows = (
            self._db.query(ORMDisease)
            .order_by(ORMDisease.id.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        return [orm_to_entity(r, Disease) for r in rows]

    def list_all(self) -> Sequence[Disease]:
        rows = self._db.query(ORMDisease).order_by(ORMDisease.id.asc()).all()
        return [orm_to_entity(r, Disease) for r in rows]
