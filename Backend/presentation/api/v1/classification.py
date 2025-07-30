import os
import uuid
import logging
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pathlib import Path
from typing import List

from domain.interfaces.unit_of_work import IUnitOfWork
from presentation.di import get_uow
from presentation.security import require_role
from presentation.schemas.classification import ClassificationResponseOut, ClassificationResultOut

from application.usecases.commands.classification.classify_image import (
    ClassifyImageCommand,
    classify_image,
    ClassificationResult
)

# Configure logging
logger = logging.getLogger("classification_api")

router = APIRouter(prefix="/classification", tags=["Classification"])

# Define the uploads directory
UPLOADS_DIR = Path(__file__).parent.parent.parent.parent / "resources" / "uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True)


@router.post("/classify", response_model=ClassificationResponseOut)
async def classify_disease_image(
    file: UploadFile = File(...),
    max_phrases: int = 12,
    top_k: int = 5,
    uow: IUnitOfWork = Depends(get_uow),
    _=Depends(require_role("doctor")),
):
    """
    Classify a medical image to identify potential diseases.
    
    The API will:
    1. Save the uploaded image
    2. Process the image with MedCLIP model
    3. Return top diseases with similarity scores
    
    Args:
        file: The uploaded medical image
        max_phrases: Maximum number of phrases to sample per disease
        top_k: Number of top predictions to return
        
    Returns:
        List of potential diseases with similarity scores
    """
    # Validate file is an image
    if not file.content_type.startswith("image/"):
        logger.warning(f"Rejected non-image file: {file.filename} ({file.content_type})")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Generate unique filename and save
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOADS_DIR / unique_filename
    
    logger.info(f"Saving uploaded image as: {file_path}")
    
    # Save the uploaded file
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    try:
        # Classify the image
        logger.info(f"Starting classification for image: {unique_filename}")
        command = ClassifyImageCommand(
            image_path=str(file_path),
            max_phrases=max_phrases,
            top_k=top_k
        )
        
        results = classify_image(command, uow)
        logger.info(f"Classification complete for {unique_filename}, found {len(results)} matches")
        
        # Convert results to output schema
        return ClassificationResponseOut(
            results=[
                ClassificationResultOut(
                    disease_name=r.disease_name,
                    score=r.score,
                    best_phrase=r.best_phrase
                )
                for r in results
            ]
        )
        
    except Exception as e:
        logger.error(f"Error classifying image {unique_filename}: {str(e)}", exc_info=True)
        # Clean up file in case of error
        if file_path.exists():
            os.unlink(file_path)
            logger.info(f"Removed file {unique_filename} due to error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error classifying image: {str(e)}"
        )
