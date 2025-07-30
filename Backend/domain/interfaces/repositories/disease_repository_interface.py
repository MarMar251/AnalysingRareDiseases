# domain/interfaces/repositories/disease_repository_interface.py
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional, Sequence

from domain.entities.disease import Disease
from domain.value_objects.disease_create_vo import DiseaseCreateVO
from domain.interfaces.repositories.base_repository import IRepository


class IDiseaseRepository(IRepository[Disease], ABC):
    """
    Abstract repository for Disease aggregate.
    """

    # ---------- Commands ----------
    @abstractmethod
    def create(self, payload: DiseaseCreateVO) -> Disease:
        """
        Persist a new Disease entity.

        payload.doctor_id is stored in DB, but *not* used for filtering
        in any read-queries.
        """
        ...

    @abstractmethod
    def delete(self, id: int) -> None:  # noqa: D401
        """Remove Disease by primary key (no-op if not found)."""
        ...
    @abstractmethod
    def update_description(self, id: int, description: str) -> Optional[Disease]:
        """
        Update only the description field; return updated entity or None if not found.
        """
        ...

    # ---------- Queries ----------
    @abstractmethod
    def get_by_id(self, id: int) -> Optional[Disease]:
        ...

    @abstractmethod
    def get_by_name(self, name: str) -> Optional[Disease]:
        ...

    @abstractmethod
    def list(self, skip: int = 0, limit: int = 10) -> Sequence[Disease]:
        """
        Return *all* diseases, paginated (no doctor_id filter).
        """
        ...

    @abstractmethod
    def list_all(self) -> Sequence[Disease]:
        """
        Return every Disease row in the table.
        """
        ...
