from dataclasses import dataclass
from datetime import date
from typing import Optional

from domain.interfaces.unit_of_work import IUnitOfWork
from domain.entities.patient import Patient
from domain.value_objects.gender import Gender
from domain.value_objects.date_of_birth import DateOfBirth
from application.usecases.errors import PatientAlreadyExistsError, InvalidDateOfBirthError


@dataclass(slots=True)
class AddPatientCommand:
    full_name: str
    birth_date: date
    phone_number: str
    gender: Gender
    created_by: Optional[int] = None


def add_patient(cmd: AddPatientCommand, uow: IUnitOfWork) -> Patient:
    with uow:
        # Check duplication by phone
        existing = uow.patients.get_by_phone(cmd.phone_number)
        if existing:
            raise PatientAlreadyExistsError()

        # Validate birth date
        try:
            dob = DateOfBirth(cmd.birth_date)
        except InvalidDateOfBirthError as e:
            raise e

        patient = uow.patients.create(
            full_name=cmd.full_name,
            birth_date=dob, 
            phone_number=cmd.phone_number,
            gender=cmd.gender,
            created_by=cmd.created_by,
        )

        uow.commit()
        return patient

