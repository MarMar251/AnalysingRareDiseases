from dataclasses import dataclass

from domain.interfaces.unit_of_work import IUnitOfWork
from domain.interfaces.security.password_hasher import IPasswordHasher
from domain.interfaces.security.token_service import TokenService
from domain.value_objects.email_address import EmailAddress
from application.usecases.errors import InvalidCredentialsError
from presentation.schemas.user import Token


@dataclass(slots=True)
class LoginUserCommand:
    email: str
    password: str


@dataclass(slots=True)
class TokenData:
    access_token: str
    token_type: str = "bearer"


def login_user(
    cmd: LoginUserCommand,
    uow: IUnitOfWork,
    hasher: IPasswordHasher,
    token_service: TokenService,
) -> TokenData:
    user = uow.users.get_by_email(EmailAddress(cmd.email))
    if user is None or not hasher.verify(cmd.password, user.hashed_password):
        raise InvalidCredentialsError

    jwt = token_service.encode(sub=str(user.id), role=user.role.value)
    return Token(access_token=jwt, token_type="bearer")
