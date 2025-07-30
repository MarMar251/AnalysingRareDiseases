from typing import Any, Dict, Optional
from domain.interfaces.unit_of_work import IUnitOfWork
from application.usecases.errors import UserNotFoundError
from domain.entities.user import User
from domain.interfaces.security.password_hasher import IPasswordHasher


def update_user_profile(
    uow: IUnitOfWork,
    user_id: int,
    updates: Dict[str, Any],
    password_hasher: Optional[IPasswordHasher] = None,
) -> User:
    # If password is being updated, hash it first
    if "password" in updates and updates["password"] and password_hasher:
        updates["hashed_password"] = password_hasher.hash(updates["password"])
        # Remove the plain text password from updates
        del updates["password"]
    
    user = uow.users.update(user_id, updates)
    if user is None:
        raise UserNotFoundError
    uow.commit()
    return user
