from pydantic import BaseModel
from typing import List


class ClassificationResultOut(BaseModel):
    disease_name: str
    score: float
    best_phrase: str


class ClassificationResponseOut(BaseModel):
    results: List[ClassificationResultOut] 