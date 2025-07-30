# domain/interfaces/security/token_service.py
from abc import ABC, abstractmethod
from datetime import timedelta
from typing import Any, Dict, Optional


class TokenService(ABC):
    """
    Encode / decode JWT access-tokens.
    """

    # -------------------------------------------------
    # ENCODE
    # -------------------------------------------------
    @abstractmethod
    def encode(
        self,
        sub: str,
        role: str,
        *,
        expires: Optional[timedelta] = None,
        jti: Optional[str] = None,         
        extra: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Return a signed JWT string.

        • `jti` (JWT ID) will be generated (uuid4) if not provided.
        • `extra` allows arbitrary custom claims.
        """
        ...

    # -------------------------------------------------
    # DECODE
    # -------------------------------------------------
    @abstractmethod
    def decode(self, token: str) -> Dict[str, Any]:
        """
        Decode & verify token and return the payload dict
        (must contain at least: sub, role, jti, exp).
        """
        ...
