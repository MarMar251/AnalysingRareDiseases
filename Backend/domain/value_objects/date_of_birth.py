# domain/value_objects/date_of_birth.py
from dataclasses import dataclass
from datetime import date

from application.usecases.errors import InvalidDateOfBirthError 

@dataclass(frozen=True, slots=True)
class DateOfBirth:
    value: date

    def __post_init__(self):
        today = date.today()

        if self.value >= today:
            raise InvalidDateOfBirthError("Birth date must be before today.")

        if self.value.year < 1900:
            raise InvalidDateOfBirthError("Birth date cannot be before the year 1900.")

    @property
    def age(self) -> int:
        today = date.today()
        years = today.year - self.value.year
        if (today.month, today.day) < (self.value.month, self.value.day):
            years -= 1
        return years
