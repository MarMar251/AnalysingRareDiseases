# domain/interfaces/repositories/token_blacklist_repository.py
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Protocol


class ITokenBlacklistRepository(Protocol):

    @abstractmethod
    def add(self, jti: str, expires_at: datetime) -> None: ...

    @abstractmethod
    def exists(self, jti: str) -> bool: ...
