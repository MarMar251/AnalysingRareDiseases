from dataclasses import dataclass
from domain.interfaces.unit_of_work import IUnitOfWork
from domain.interfaces.security.password_hasher import IPasswordHasher
from domain.entities.user import User, UserRole
from domain.value_objects.email_address import EmailAddress
from application.usecases.errors import UserAlreadyExistsError


@dataclass(slots=True)
class RegisterUserCommand:
    full_name: str
    email: str
    password: str
    phone_number: str
    role: UserRole = UserRole.DOCTOR


def register_user(
    cmd: RegisterUserCommand,
    uow: IUnitOfWork,
    hasher: IPasswordHasher,
) -> User:
    if uow.users.get_by_email(EmailAddress(cmd.email)):
        raise UserAlreadyExistsError

    hashed = hasher.hash(cmd.password)
    user = User(
        id=None,
        full_name=cmd.full_name,
        email=cmd.email,
        phone_number=cmd.phone_number,
        role=cmd.role,
        
    )
    user = uow.users.create(user, hashed_password=hashed)
    uow.commit()
    return user
