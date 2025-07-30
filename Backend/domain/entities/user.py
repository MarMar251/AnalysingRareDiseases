# domain/entities/user.py
from dataclasses import dataclass
from enum import Enum
from typing import Optional
from datetime import datetime

class UserRole(str, Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    NURSE = "nurse"


@dataclass(slots=True)
class User:
    id: int
    full_name: str
    email: str
    phone_number: str
    role: UserRole
    hashed_password: Optional[str] = None
    created_at: Optional[datetime] = None
