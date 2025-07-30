
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import uuid

from jose import jwt, JWTError

from domain.interfaces.security.token_service import TokenService
from core.settings import settings


class JWTTokenService(TokenService):

    def encode(
        self,
        sub: str,
        role: str,
        expires: Optional[timedelta] = None,
        extra: Optional[Dict[str, Any]] = None,
    ) -> str:

        exp_dt = datetime.now(tz=timezone.utc) + (
            expires or settings.access_token_expire
        )
        payload: Dict[str, Any] = {
            "sub": sub,
            "role": role,
            "exp": exp_dt,
            "jti": uuid.uuid4().hex,
        }
        if extra:
            payload.update(extra)

        return jwt.encode(
            payload,
            settings.secret_key,
            algorithm=settings.algorithm,
        )

    def decode(self, token: str) -> Dict[str, Any]:

        try:
            return jwt.decode(
                token,
                settings.secret_key,
                algorithms=[settings.algorithm],
            )
        except JWTError as exc:
            raise ValueError("Invalid or expired token") from exc
