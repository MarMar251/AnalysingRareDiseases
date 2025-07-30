from datetime import datetime
from sqlalchemy.orm import Session
from domain.interfaces.repositories.token_blacklist_repository import (
    ITokenBlacklistRepository,
)
from infrastructure.db.models.token_blacklist import TokenBlacklist


class TokenBlacklistRepository(ITokenBlacklistRepository):
    def __init__(self, db: Session) -> None:
        self._db = db

    def add(self, jti: str, expires_at: datetime) -> None:
        self._db.add(TokenBlacklist(jti=jti, expires_at=expires_at))
        self._db.flush()

    def exists(self, jti: str) -> bool:
        return (
            self._db.query(TokenBlacklist)
            .filter(TokenBlacklist.jti == jti)
            .first()
            is not None
        )
