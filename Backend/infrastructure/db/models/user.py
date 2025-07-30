from __future__ import annotations

import enum
from sqlalchemy import Column, Integer, String, DateTime, Enum as SAEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from infrastructure.db.base import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    NURSE = "nurse"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(
        SAEnum(
            UserRole,
            name="user_role",
            values_callable=lambda e: [m.value for m in e],
        ),
        nullable=False,
    )
    full_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # relationships
    diseases_added = relationship(
        "Disease",
        back_populates="doctor",
        cascade="all, delete-orphan",
        passive_deletes=True,
        foreign_keys="Disease.doctor_id",
    )
    diseases_assigned = relationship(
        "PatientDisease",
        back_populates="doctor",
        cascade="all, delete-orphan",
        passive_deletes=True,
        foreign_keys="PatientDisease.doctor_id",
    )

    # convenience
    def __repr__(self) -> str:  
        return f"<User id={self.id} email={self.email}>"
