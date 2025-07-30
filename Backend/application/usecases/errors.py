# application/usecases/errors.py
class DiseaseAlreadyExistsError(Exception):
    """Raised when trying to add a disease with a duplicated name."""


class PatientNotFoundError(Exception):
    """Raised when a patient with the given ID does not exist."""

class PatientDiseaseLinkExistsError(Exception):
    """Raised when a the disease is already exist."""

class PatientDiseaseLinkNotFoundError(Exception):
    """Raised when the link between a patient and a disease is not found."""


class UserAlreadyExistsError(Exception):
    """Raised when trying to register a user with an email that already exists."""


class UserNotFoundError(Exception):
    """Raised when a user is not found by ID or email."""


class InvalidCredentialsError(Exception):
    """Raised when login credentials are invalid (wrong email or password)."""

class DiseaseNotFoundError(Exception):
    """Raised when the disease is not found."""

class PatientAlreadyExistsError(Exception):
    """Raised when trying to add a patient with a duplicated phone number."""

class InvalidDateOfBirthError(Exception):
    """Raised when the birth date is not logically valid."""

class ForbiddenDiseaseEditError(Exception):
    """Doctor tried to edit a disease he didn't create."""
    pass

