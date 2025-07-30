from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from presentation.schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientOut,
)
from presentation.di import get_uow
from presentation.security import require_role
from domain.interfaces.unit_of_work import IUnitOfWork

# Use-Cases
from application.usecases.commands.patient.add_patient import (
    AddPatientCommand,
    add_patient,
)
from application.usecases.commands.patient.update_patient import update_patient
from application.usecases.commands.patient.delete_patient import delete_patient
from application.usecases.queries.patient.get_patient_by_id import (
    GetPatientByIdQuery,
    get_patient_by_id,
)
from application.usecases.queries.patient.get_patients_by_creator import get_patients_by_creator, GetPatientsByCreatorQuery
from application.usecases.queries.patient.get_all_patients import get_all_patients
from application.usecases.errors import (
    PatientNotFoundError,
    PatientAlreadyExistsError,
    InvalidDateOfBirthError,
)

router = APIRouter(prefix="/patients", tags=["Patients"])


# ── List patients (Doctor | Nurse ) ──────────────────────────────────
@router.get("", response_model=List[PatientOut])
def list__patients_endpoint(
    uow: IUnitOfWork = Depends(get_uow),
    current_user=Depends(require_role("doctor", "nurse")),
):
    if current_user.role == "nurse":
        patients = get_all_patients(uow=uow)
    else:  # role == "doctor"
        patients = get_patients_by_creator(
            GetPatientsByCreatorQuery(creator_id=current_user.id), uow=uow
        )
    return [PatientOut.from_entity(p) for p in patients]


# ── Create new patient (Nurse) ───────────────────────────────────────
@router.post("", response_model=PatientOut, status_code=status.HTTP_201_CREATED)
def create_patient_endpoint(
    payload: PatientCreate,
    uow: IUnitOfWork = Depends(get_uow),
    _=Depends(require_role("nurse")),
):
    try:
        patient_entity = add_patient(
            AddPatientCommand(
                full_name=payload.full_name,
                birth_date=payload.birth_date,
                phone_number=payload.phone_number,
                gender=payload.gender,
                created_by=payload.created_by,
            ),
            uow,
        )
        return PatientOut.from_entity(patient_entity)

    except PatientAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A patient with this phone number already exists.",
        )
    except InvalidDateOfBirthError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Enter a valid date.",
        )


# ── Get patient by id (Doctor | Nurse) ───────────────────────────────
@router.get("/{patient_id}", response_model=PatientOut)
def get_patient_by_id_endpoint(
    patient_id: int,
    uow: IUnitOfWork = Depends(get_uow),
    _=Depends(require_role("doctor", "nurse")),
):
    try:
        patient = get_patient_by_id(GetPatientByIdQuery(patient_id), uow=uow)
    except PatientNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    return PatientOut.from_entity(patient)


# ── Update patient (Nurse) ───────────────────────────────────────────
@router.put("/{patient_id}", response_model=PatientOut)
def update_patient_endpoint(
    patient_id: int,
    payload: PatientUpdate,
    uow: IUnitOfWork = Depends(get_uow),
    _=Depends(require_role("nurse")),
):
    try:
        patient = update_patient(
            uow=uow,
            patient_id=patient_id,
            name=payload.full_name,
            phone=payload.phone_number,
            birth_date=payload.birth_date,
        )
        return PatientOut.from_entity(patient)

    except PatientNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    except InvalidDateOfBirthError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Enter a valid date.",
        )
    except PatientAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A patient with this phone number already exists.",
        )


# ── Delete patient ─────────────────────────────────────────────
@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient_endpoint(
    patient_id: int,
    uow: IUnitOfWork = Depends(get_uow),
    _=Depends(require_role("nurse")),
):
    delete_patient(uow=uow, patient_id=patient_id)
