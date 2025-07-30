from typing import Generator
from typing import Annotated

from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from domain.entities.user import User as DomainUser
from domain.interfaces.unit_of_work import IUnitOfWork

from infrastructure.db.session import get_db 
from infrastructure.auth.jwt_token_service import JWTTokenService
from infrastructure.auth.bcrypt_hasher import BcryptHasher
from infrastructure.db.models.user import User, UserRole
from domain.interfaces.security.token_service import TokenService
from presentation.di import get_uow, get_token_service

# ── Services instances ───────────────────────────────────────
token_service: TokenService = JWTTokenService()
password_hasher = BcryptHasher()  

# ── FastAPI security scheme ─────────────────────────────────
bearer_scheme = HTTPBearer()


# ---------- current user ----------
def get_current_user(
    token: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
    uow: Annotated[IUnitOfWork, Depends(get_uow)],
    token_service: Annotated[TokenService, Depends(get_token_service)],
) -> DomainUser:
    """
    1. Decode & validate the JWT.
    2. Reject if jti is revoked.
    3. Load and return the DomainUser entity.
    """
    # Decode & verify signature, expiry, etc.
    try:
        payload = token_service.decode(token.credentials)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    # Check revocation
    jti = payload.get("jti")
    if not jti or uow.token_blacklist.exists(jti):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token revoked or invalid",
        )

    # Extract subject & load user
    sub = payload.get("sub")
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed token: subject missing",
        )

    user = uow.users.get_by_id(int(sub))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user

# ---------- role-based dependency ----------
def require_role(*roles: str):
    allowed = {r.lower() for r in roles}

    def checker(user: User = Depends(get_current_user)):
        role_str = user.role.value if hasattr(user.role, "value") else str(user.role).lower()
        if role_str not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied for role '{role_str}'",
            )
        return user

    return checker

