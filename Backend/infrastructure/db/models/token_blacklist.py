from sqlalchemy import Column, String, DateTime
from infrastructure.db.base import Base


class TokenBlacklist(Base):
    __tablename__ = "token_blacklist"

    jti = Column(String(64), primary_key=True)
    expires_at = Column(DateTime, nullable=False)
