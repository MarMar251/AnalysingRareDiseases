from __future__ import annotations

from pydantic import BaseModel, Field, validator
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from domain.entities.disease import Disease


class DiseaseCreate(BaseModel):
    name: str = Field(..., example="Asthma")
    description: str = Field(
        ..., 
        max_length=15000,
        example="An MRI image showing …\nCoronal views confirm …\nAxial T1-weighted sequences reveal …",
    )

    # Convert list to string if needed
    @validator("description", pre=True)
    # pylint: disable=no-self-argument
    def _convert_list_to_str(cls, v):
        if isinstance(v, list):
            return "\n".join(item.strip() for item in v if item.strip())
        return v

    @validator("description")
    # pylint: disable=no-self-argument
    def _not_empty(cls, v):
        if not v.strip():
            raise ValueError("Description cannot be empty")
        return v


class DiseaseDescriptionUpdate(BaseModel):
    description: str = Field(
        ..., 
        max_length=15000,
        example="A chronic inflammatory disease of the airways.\nCommonly presents with wheezing and shortness of breath."
    )

    @validator("description", pre=True)
    # pylint: disable=no-self-argument
    def _convert_list_to_str(cls, v):
        if isinstance(v, list):
            return "\n".join(item.strip() for item in v if item.strip())
        return v

    @validator("description")
    # pylint: disable=no-self-argument
    def _not_empty(cls, v):
        if not v.strip():
            raise ValueError("Description cannot be empty")
        return v


# DTO – API output for returning disease info
class DiseaseOut(BaseModel):
    id: int
    name: str
    description: str  

    @classmethod
    def from_entity(cls, disease: "Disease") -> "DiseaseOut":
        return cls(
            id=disease.id,
            name=disease.name,
            description=disease.description,  
        )

    class Config:
        model_config = {"from_attributes": True}
