# domain/interfaces/security/password_hasher.py
from abc import ABC, abstractmethod


class IPasswordHasher(ABC):
    """
    Interface for hashing and verifying passwords.
    """

    @abstractmethod
    def hash(self, plain_password: str) -> str:
        """
        Hash the given plain-text password and return the hash.
        """
        pass

    @abstractmethod
    def verify(self, plain_password: str, hashed_password: str) -> bool:
        """
        Return True if the plain password matches the hashed password.
        """
        pass
