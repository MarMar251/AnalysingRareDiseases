from abc import ABC, abstractmethod
from typing import List, Optional

from domain.entities.disease import Disease


class IClassificationRepository(ABC):
    """
    Abstract repository for classification operations.
    """
    
    @abstractmethod
    def classify_image(self, image_path: str, diseases: List[Disease], max_phrases: int = 12, top_k: int = 5) -> List[dict]:
        """
        Classify an image against a list of diseases.
        
        Args:
            image_path: Path to the image file
            diseases: List of diseases to compare against
            max_phrases: Maximum number of phrases to sample per disease
            top_k: Number of top predictions to return
            
        Returns:
            List of dictionaries with disease name, score, and best matching phrase
        """
        ...
        
    @abstractmethod
    def initialize_model(self) -> None:
        """
        Initialize the classification model.
        This should be called once during application startup.
        """
        ...