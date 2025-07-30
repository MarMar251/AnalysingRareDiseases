from __future__ import annotations

from typing import Optional, Sequence, List
from sqlalchemy.orm import Session

from domain.entities.patient_disease import PatientDisease
from domain.interfaces.repositories.patient_disease_repository_interface import IPatientDiseaseRepository

from infrastructure.db.models.patient_disease import PatientDisease as ORMLink
from infrastructure.db.models.disease import Disease as ORMDisease
from infrastructure.db.repositories._mapping import orm_to_entity
from sqlalchemy.orm import joinedload


class PatientDiseaseRepository(IPatientDiseaseRepository):
    def __init__(self, db: Session):
        self._db = db

    # ---------- Commands ----------
    def assign(
        self, *, patient_id: int, disease_id: int, doctor_id: int
    ) -> PatientDisease:
        link = ORMLink(
            patient_id=patient_id, disease_id=disease_id, doctor_id=doctor_id
        )
        self._db.add(link)
        self._db.flush()
        return orm_to_entity(link, PatientDisease)

    def delete(self, id: int) -> None:
        link = self._db.query(ORMLink).get(id)
        if link:
            self._db.delete(link)

    # ---------- Queries ----------
    def get_by_patient_and_disease(
        self, patient_id: int, disease_id: int
    ) -> Optional[PatientDisease]:
        link = (
            self._db.query(ORMLink)
            .filter(
                ORMLink.patient_id == patient_id,
                ORMLink.disease_id == disease_id,
            )
            .first()
        )
        return orm_to_entity(link, PatientDisease) if link else None

    def get_disease_names_by_patient_id(self, patient_id: int) -> Sequence[str]:
        rows = (
            self._db.query(ORMDisease.name)
            .join(ORMLink, ORMLink.disease_id == ORMDisease.id)
            .filter(ORMLink.patient_id == patient_id)
            .all()
        )
        return [name for (name,) in rows]

    def get_by_id(self, id: int) -> Optional[PatientDisease]:
        link = self._db.query(ORMLink).get(id)
        return orm_to_entity(link, PatientDisease) if link else None

    # ---------- BaseRepository ----------
    def list(self, skip: int = 0, limit: int = 10) -> Sequence[PatientDisease]:
        rows = (
            self._db.query(ORMLink).offset(skip).limit(limit).all()
        )
        return [orm_to_entity(r, PatientDisease) for r in rows]

    def list_all(self) -> Sequence[PatientDisease]:
        rows = self._db.query(ORMLink).all()
        return [orm_to_entity(r, PatientDisease) for r in rows]
    
    def get_details_by_patient_id(self, patient_id: int) -> Sequence[PatientDisease]:
        rows = (
            self._db.query(ORMLink)
            .options(
                joinedload(ORMLink.disease),
                joinedload(ORMLink.doctor),
            )
            .filter(ORMLink.patient_id == patient_id)
            .all()
        )

        return [
            orm_to_entity(row, PatientDisease, extra={
                "disease": row.disease,
                "doctor": row.doctor,
            }) for row in rows
        ]
