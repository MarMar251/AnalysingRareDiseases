"""
Infrastructure implementation of the MedCLIP classifier
"""

from core.settings import settings


def get_model_path() -> str:
    """
    Get the path to the MedCLIP model file

    Returns:
        Path to the model file as a string
    """
    model_path = settings.medclip_model_path

    if not model_path.exists():
        raise FileNotFoundError(f"MedCLIP model not found at {model_path}")

    return str(model_path)
