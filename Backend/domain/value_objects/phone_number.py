# domain/value_objects/phone_number.py
from dataclasses import dataclass
import re

@dataclass(frozen=True, slots=True)
class PhoneNumber:
    value: str

    def __post_init__(self):
        if not re.match(r"^\+?\d{9,15}$", self.value):
            raise ValueError("Invalid phone number format")
