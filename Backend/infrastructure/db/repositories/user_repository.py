from __future__ import annotations

from typing import Optional, Dict, Any, Sequence
from sqlalchemy.orm import Session

from domain.entities.user import User
from domain.value_objects.email_address import EmailAddress
from domain.interfaces.repositories.user_repository_interface import IUserRepository

from infrastructure.db.models.user import User as ORMUser
from infrastructure.db.repositories._mapping import orm_to_entity

class UserRepository(IUserRepository):
    def __init__(self, db: Session):
        self._db = db

    # ---------- Commands ----------
    def create(self, user: User, hashed_password: str) -> User:
        orm_obj = ORMUser(
            email=user.email,
            full_name=user.full_name,
            phone_number=user.phone_number,
            hashed_password=hashed_password,
            role=user.role,
        )
        self._db.add(orm_obj)
        self._db.flush()
        return orm_to_entity(orm_obj, User)

    def update(self, user_id: int, updates: Dict[str, Any]) -> Optional[User]:
        obj = self._db.query(ORMUser).get(user_id)
        if not obj:
            return None
        for k, v in updates.items():
            setattr(obj, k, v)
        self._db.flush()
        return orm_to_entity(obj, User)

    def delete(self, user_id: int) -> None:
        obj = self._db.query(ORMUser).get(user_id)
        if obj:
            self._db.delete(obj)

    # ---------- Queries ----------
    def get_by_email(self, email: EmailAddress) -> Optional[User]:
        orm = self._db.query(ORMUser).filter(ORMUser.email == email.value).first()
        return orm_to_entity(orm, User) if orm else None

    def get_by_id(self, user_id: int) -> Optional[User]:
        obj = self._db.query(ORMUser).get(user_id)
        return orm_to_entity(obj, User) if obj else None

    # ---------- BaseRepository ----------
    def list(self, skip: int = 0, limit: int = 10) -> Sequence[User]:
        rows = (
            self._db.query(ORMUser).offset(skip).limit(limit).all()
        )
        return [orm_to_entity(r, User) for r in rows]

    def list_all(self) -> Sequence[User]:
        rows = self._db.query(ORMUser).all()
        return [orm_to_entity(r, User) for r in rows]
    
    def get_by_role(self, role: str) -> list[User]:
        rows = self._db.query(ORMUser).filter(ORMUser.role == role).all()
        return [orm_to_entity(r, User) for r in rows]
