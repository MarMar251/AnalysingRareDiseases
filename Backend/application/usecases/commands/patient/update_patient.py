from typing import Optional

from domain.interfaces.unit_of_work import IUnitOfWork
from domain.entities.patient import Patient
from application.usecases.errors import PatientNotFoundError, InvalidDateOfBirthError, PatientAlreadyExistsError
from domain.value_objects.date_of_birth import DateOfBirth


def update_patient(
    uow: IUnitOfWork,
    patient_id: int,
    name: Optional[str] = None,
    phone: Optional[str] = None,
    birth_date: Optional[str] = None
) -> Patient:
    with uow:
        # First check if patient exists
        current_patient = uow.patients.get_by_id(patient_id)
        if current_patient is None:
            raise PatientNotFoundError
            
        # Check phone number uniqueness if it's being updated
        if phone is not None and phone != current_patient.phone_number:
            existing = uow.patients.get_by_phone(phone)
            if existing and existing.id != patient_id:
                raise PatientAlreadyExistsError()
        
        updates = {}
        if name is not None:
            updates["full_name"] = name
        
        if phone is not None:
            updates["phone_number"] = phone
        
        if birth_date is not None:
            try:
                dob = DateOfBirth(birth_date)
                updates["birth_date"] = dob.value
            except InvalidDateOfBirthError as e:
                raise e

        patient = uow.patients.update(patient_id, updates)
        if patient is None:
            raise PatientNotFoundError

        uow.commit()
        return patient
