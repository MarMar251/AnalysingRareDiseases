from dataclasses import dataclass
from typing import List, Dict, Any
import logging

from domain.interfaces.unit_of_work import IUnitOfWork

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ClassifyImageUseCase")


@dataclass
class ClassifyImageCommand:
    image_path: str
    max_phrases: int = 12
    top_k: int = 5


@dataclass
class ClassificationResult:
    disease_name: str
    score: float
    best_phrase: str


def classify_image(command: ClassifyImageCommand, uow: IUnitOfWork) -> List[ClassificationResult]:
    """
    Classify an image against all diseases in the database
    
    Args:
        command: ClassifyImageCommand with image path and parameters
        uow: Unit of work for database access
        
    Returns:
        List of ClassificationResult objects
    """
    logger.info(f"Processing classification request for image: {command.image_path}")
    
    with uow:
        # Fetch all diseases from the database
        diseases = uow.diseases.list_all()
        
        # Use classification repository to classify the image
        results_dicts = uow.classification.classify_image(
            image_path=command.image_path,
            diseases=diseases,
            max_phrases=command.max_phrases,
            top_k=command.top_k
        )
    
    # Convert dictionaries to ClassificationResult objects
    results = [
        ClassificationResult(
            disease_name=r["disease_name"],
            score=r["score"],
            best_phrase=r["best_phrase"]
        )
        for r in results_dicts
    ]
    
    logger.info(f"Classification complete. Found {len(results)} matching diseases.")
    return results