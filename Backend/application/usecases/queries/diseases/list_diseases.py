from typing import Sequence
from dataclasses import dataclass

from domain.interfaces.unit_of_work import IUnitOfWork
from domain.entities.disease import Disease


@dataclass(slots=True)
class ListDiseasesQuery:
    skip: int = 0
    limit: int = 100


def list_diseases(q: ListDiseasesQuery, *, uow: IUnitOfWork) -> Sequence[Disease]:
    return uow.diseases.list(skip=q.skip, limit=q.limit)
