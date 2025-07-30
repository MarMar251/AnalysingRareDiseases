# Generic repository interface
# ------------------------------
from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, Sequence

T = TypeVar("T")

class IRepository(ABC, Generic[T]):

    @abstractmethod
    def get_by_id(self, id: int) -> Optional[T]:
        pass

    @abstractmethod
    def delete(self, id: int) -> None:
        pass

    @abstractmethod
    def list_all(self) -> Sequence[T]:
        pass