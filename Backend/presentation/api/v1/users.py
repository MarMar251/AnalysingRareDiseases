from fastapi import APIRouter, Depends, HTTPException, Response, Security, status
from fastapi.security import HTTPAuthorizationCredentials
from typing import Annotated

from application.usecases.commands.user.register_user import (
    RegisterUserCommand, 
    register_user,
)
from application.usecases.commands.user.login_user import (
    LoginUserCommand,
    login_user,
)
from application.usecases.commands.user.delete_user import delete_user

from application.usecases.commands.user.update_user_profile import update_user_profile
from application.usecases.queries.users.list_users import list_users
from application.usecases.queries.users.get_user_by_id import (
    GetUserByIdQuery,
    get_user_by_id,
)

from application.usecases.commands.user.logout_user import (
    LogoutUserCommand,
    logout_user,
)

from application.usecases.errors import (
    UserAlreadyExistsError,
    InvalidCredentialsError,
    UserNotFoundError,
)
from presentation.schemas.user import (
    UserCreate,
    UserOut,
    UserLogin,
    UserUpdate,
    Token,         
)
from presentation.di import get_uow, get_token_service, get_password_hasher
from presentation.security import require_role, get_current_user, bearer_scheme
from domain.interfaces.unit_of_work import IUnitOfWork
from domain.interfaces.security.token_service import TokenService
from domain.interfaces.security.password_hasher import IPasswordHasher
from dataclasses import asdict 
from presentation.di import get_uow, get_token_service
from application.usecases.queries.users.list_doctors import list_doctors


router = APIRouter(prefix="/users", tags=["Users"])


# -------- Register -------------------------------------------------------
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_user_endpoint(
    payload: UserCreate,
    uow: IUnitOfWork = Depends(get_uow),
    hasher: IPasswordHasher = Depends(get_password_hasher),
    _ = Depends(require_role("admin")),  
):
    try:
        user_entity = register_user(
            RegisterUserCommand(
                full_name=payload.full_name,
                email=payload.email,
                password=payload.password,
                phone_number=payload.phone_number,
                role=payload.role,
            ),
            uow,
            hasher,
        )
    except UserAlreadyExistsError:
        raise HTTPException(400, "User with this email already exists")
    return UserOut.from_entity(user_entity)


# -------- Login ----------------------------------------------------------
@router.post("/login", response_model=Token)
def login_user_endpoint(
    credentials: UserLogin,
    uow: IUnitOfWork = Depends(get_uow),
    hasher: IPasswordHasher = Depends(get_password_hasher),
    token_srv: TokenService = Depends(get_token_service),
):
    try:
        token_data = login_user(
            LoginUserCommand(email=credentials.email, password=credentials.password),
            uow,
            hasher,
            token_srv,
        )
    except InvalidCredentialsError:
        raise HTTPException(401, "Invalid credentials")

    return token_data

# GET /api/v1/users/doctors

@router.get("/doctors", response_model=list[UserOut])
def list_doctors_endpoint(
    uow: IUnitOfWork = Depends(get_uow),
    _ = Depends(require_role("admin", "nurse")),
):
    doctors = list_doctors(uow=uow)
    return [UserOut.from_entity(doc) for doc in doctors]


# -------- Get by ID ------------------------------------------------------
@router.get("/{user_id}", response_model=UserOut)
def get_user_by_id_endpoint(
    user_id: int,
    uow: IUnitOfWork = Depends(get_uow),
    _ = Depends(require_role("admin")),
):
    try:
        user_entity = get_user_by_id(GetUserByIdQuery(user_id=user_id), uow=uow)
    except UserNotFoundError:
        raise HTTPException(404, "User not found")
    return UserOut.from_entity(user_entity)


# -------- Update ---------------------------------------------------------
@router.put("/{user_id}", response_model=UserOut)
def update_user_profile_endpoint(
    user_id: int,
    update_data: UserUpdate,
    uow: IUnitOfWork = Depends(get_uow),
    hasher: IPasswordHasher = Depends(get_password_hasher),
    _ = Depends(require_role("admin")),
):
    try:
        user_entity = update_user_profile(
            uow=uow, 
            user_id=user_id, 
            updates=update_data.model_dump(exclude_unset=True),
            password_hasher=hasher
        )
        return UserOut.from_entity(user_entity)
    except UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")

# ───────────────────────── Logout (FIXED) ───────────────────────────────
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout_endpoint(
    token: Annotated[HTTPAuthorizationCredentials, Security(bearer_scheme)],
    _: Annotated[object, Depends(get_current_user)],
    token_srv: TokenService = Depends(get_token_service),
    uow: IUnitOfWork = Depends(get_uow),
):
    """
    Revoke the current JWT by adding its jti to the blacklist.
    """
    payload = token_srv.decode(token.credentials)
    logout_user(
        LogoutUserCommand(
            jti=payload["jti"],
            expires_at=payload["exp"],
        ),
        uow=uow,
    )
    

# GET /api/v1/users
@router.get("", response_model=list[UserOut])  
def list_users_endpoint(
    uow: IUnitOfWork = Depends(get_uow),
    _ = Depends(require_role("admin")),               
):
    return [UserOut.from_entity(u) for u in list_users(uow)]


# ── Delete user ────────────────────────────────────────────────
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_endpoint(
    user_id: int,
    uow: IUnitOfWork = Depends(get_uow),
    _ = Depends(require_role("admin")),
):
    delete_user(uow=uow, user_id=user_id)

