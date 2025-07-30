from __future__ import annotations

from typing import Optional, TYPE_CHECKING
from enum import Enum
from datetime import datetime

from pydantic import BaseModel, Field, EmailStr

if TYPE_CHECKING:
    from domain.entities.user import User


class UserRole(str, Enum):
    admin = "admin"
    doctor = "doctor"
    nurse = "nurse"


# ─────────────────────  INPUT DTOs  ───────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr = Field(..., example="doctor@example.com")
    full_name: str = Field(..., example="Dr. Mariam")
    phone_number: str = Field(..., example="0937030525")
    password: str = Field(..., min_length=6)
    role: UserRole = UserRole.doctor


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6)

    model_config = {"from_attributes": True}  


# ─────────────────────  OUTPUT DTOs  ──────────────────────────────────────
class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    phone_number: str
    role: str
    created_at: datetime

    #  helper to map Domain Entity to DTO
    @classmethod
    def from_entity(cls, user: "User") -> "UserOut":
        return cls(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            phone_number=getattr(user, "phone_number", ""),
            role=user.role.value if hasattr(user.role, "value") else str(user.role),
            created_at=getattr(user, "created_at", datetime.utcnow()),
        )

        model_config = {"from_attributes": True}


# ─────────────────────  TOKEN DTO  ────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
