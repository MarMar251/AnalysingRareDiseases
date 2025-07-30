# domain/value_objects/email_address.py
from dataclasses import dataclass
import re

@dataclass(frozen=True, slots=True)
class EmailAddress:
    value: str

    def __post_init__(self):
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w{2,}$", self.value):
            raise ValueError("Invalid email format")
