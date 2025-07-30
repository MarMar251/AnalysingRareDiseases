from typing import Sequence
from domain.entities.user import User
from domain.interfaces.unit_of_work import IUnitOfWork

def list_doctors(*, uow: IUnitOfWork) -> Sequence[User]:
    return uow.users.get_by_role("doctor")