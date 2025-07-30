# presentation/api/v1/patient_diseases.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from domain.interfaces.unit_of_work import IUnitOfWork
from presentation.di import get_uow
from presentation.security import require_role
from presentation.schemas.patient_disease import (
    AssignDiseaseInput,
    AssignedDiseaseOut,
)

from application.usecases.commands.patient_disease.assign_disease import (
    AssignDiseaseCommand,
    assign_disease_to_patient,
)
from application.usecases.commands.patient_disease.remove_disease_from_patient import (
    remove_disease_from_patient,
)
from application.usecases.queries.patient_disease.get_diseases_by_patient_id import (
    GetDiseasesByPatientQuery,
    get_diseases_by_patient_id,
)
from application.usecases.errors import (
    PatientNotFoundError,
    DiseaseNotFoundError,
    PatientDiseaseLinkExistsError,
    PatientDiseaseLinkNotFoundError,
)

from application.usecases.queries.patient_disease.list_patient_diseases_detailed import (
    ListPatientDiseasesDetailed,
)
from presentation.schemas.patient_disease import AssignedDiseaseDetailsOut


router = APIRouter(prefix="/patient-diseases", tags=["PatientDiseases"])


# ----------------- assign disease (doctor only) ---------------------------
@router.post(
    "/assign",
    response_model=AssignedDiseaseOut,
    status_code=status.HTTP_201_CREATED,
)
def assign_disease_endpoint(
    payload: AssignDiseaseInput,
    uow: IUnitOfWork = Depends(get_uow),
    user=Depends(require_role("doctor")),
):
    try:
        link = assign_disease_to_patient(
            AssignDiseaseCommand(
                patient_id=payload.patient_id,
                disease_id=payload.disease_id,
                doctor_id=user.id,
            ),
            uow,
        )
    except PatientNotFoundError:
        raise HTTPException(404, "Patient not found")
    except DiseaseNotFoundError:
        raise HTTPException(404, "Disease not found")
    except PatientDiseaseLinkExistsError:
        raise HTTPException(400, "Disease already assigned to patient")
    return AssignedDiseaseOut.from_entity(link)


# ----------------- remove disease (doctor only) ---------------------------
@router.delete(
    "/{link_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove a disease from a patient",
)
def remove_disease_endpoint(
    link_id: int,
    uow: IUnitOfWork = Depends(get_uow),
    _=Depends(require_role("doctor")),
):
    try:
        remove_disease_from_patient(uow=uow, link_id=link_id)
    except PatientDiseaseLinkNotFoundError:
        raise HTTPException(404, "Patient-Disease link not found")


# ----------------- list diseases of a patient -----------------------------
@router.get(
    "/by-patient/{patient_id}",
    response_model=List[str],
    summary="List disease names assigned to a patient",
)
def get_patient_diseases(
    patient_id: int,
    uow: IUnitOfWork = Depends(get_uow),
    _=Depends(require_role("doctor", "nurse")),
):
    return get_diseases_by_patient_id(
        GetDiseasesByPatientQuery(patient_id), uow=uow
    )


# ----------------- detailed disease info for a patient -----------------------------
@router.get(
    "/details/by-patient/{patient_id}",
    response_model=List[AssignedDiseaseDetailsOut],
    summary="Get detailed info of diseases assigned to a patient",
)
def get_patient_disease_details(
    patient_id: int,
    uow: IUnitOfWork = Depends(get_uow),
    _=Depends(require_role("doctor", "nurse")),
):
    use_case = ListPatientDiseasesDetailed(uow)
    return use_case.execute(patient_id)
