from dataclasses import dataclass

from domain.interfaces.unit_of_work import IUnitOfWork
from domain.entities.user import User
from application.usecases.errors import UserNotFoundError


@dataclass(slots=True)
class GetUserByIdQuery:
    user_id: int


def get_user_by_id(q: GetUserByIdQuery, *, uow: IUnitOfWork) -> User:
    user = uow.users.get_by_id(q.user_id)
    if user is None:
        raise UserNotFoundError
    return user
