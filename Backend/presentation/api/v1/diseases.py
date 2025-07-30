# presentation/api/v1/diseases.py
from fastapi import APIRouter, Depends, HTTPException, status

from domain.interfaces.unit_of_work import IUnitOfWork
from presentation.schemas.disease import DiseaseCreate, DiseaseOut, DiseaseDescriptionUpdate
from presentation.di import get_uow
from presentation.security import require_role

from application.usecases.commands.disease.add_disease import (
    AddDiseaseCommand,
    add_disease,
)

from application.usecases.commands.disease.update_disease_description import (
    update_disease_description,
    UpdateDiseaseDescriptionCommand,
)

from application.usecases.queries.diseases.get_disease_by_id import (
    GetDiseaseByIdQuery,
    get_disease_by_id,
)
from application.usecases.queries.diseases.list_diseases import (
    ListDiseasesQuery,
    list_diseases,
)
from application.usecases.errors import (
    DiseaseAlreadyExistsError,
    DiseaseNotFoundError,
)


router = APIRouter(prefix="/diseases", tags=["Diseases"])


# ---------------------- Create disease (doctor only) ----------------------
@router.post("/", response_model=DiseaseOut, status_code=status.HTTP_201_CREATED)
def create_disease_endpoint(
    payload: DiseaseCreate,
    uow: IUnitOfWork = Depends(get_uow),
    user=Depends(require_role("doctor")),
):
    """
    Creates a new disease record in DB and upserts its description
    into resources/description.json. If name already exists, we just
    update the description.
    """
    try:
        disease = add_disease(
            AddDiseaseCommand(
                name=payload.name,
                description=payload.description,
                doctor_id=user.id,
            ),
            uow=uow,
        )
    except DiseaseAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Disease already exists")
    return DiseaseOut.from_entity(disease)



@router.put("/{disease_id}/description", response_model=DiseaseOut)
def update_disease_description_endpoint(
    disease_id: int,
    payload: DiseaseDescriptionUpdate,
    uow: IUnitOfWork = Depends(get_uow),
    _=Depends(require_role("doctor")),
):
    try:
        disease = update_disease_description(
            UpdateDiseaseDescriptionCommand(
                disease_id=disease_id,
                new_description=payload.description,
            ),
            uow=uow,
        )
    except DiseaseNotFoundError:
        raise HTTPException(status_code=404, detail="Disease not found")
    return DiseaseOut.from_entity(disease)

# ---------------------- Get disease by ID ----------------------
@router.get("/{disease_id}", response_model=DiseaseOut)
def get_disease_endpoint(
    disease_id: int,
    uow: IUnitOfWork = Depends(get_uow),
    _=Depends(require_role("doctor", "nurse")),
):
    try:
        disease = get_disease_by_id(GetDiseaseByIdQuery(disease_id), uow=uow)
    except DiseaseNotFoundError:
        raise HTTPException(status_code=404, detail="Disease not found")
    return DiseaseOut.from_entity(disease)


# ---------------------- List diseases ----------------------
@router.get("/", response_model=list[DiseaseOut])
def list_diseases_endpoint(
    skip: int = 0,
    limit: int = 10,
    uow: IUnitOfWork = Depends(get_uow),
    _=Depends(require_role("doctor", "nurse")),
):
    diseases = list_diseases(ListDiseasesQuery(skip=skip, limit=limit), uow=uow)
    return [DiseaseOut.from_entity(d) for d in diseases]
