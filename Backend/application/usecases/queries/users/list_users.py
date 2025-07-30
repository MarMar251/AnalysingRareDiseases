from typing import List
from domain.interfaces.unit_of_work import IUnitOfWork
from domain.entities.user import User

def list_users(uow: IUnitOfWork) -> List[User]:
    with uow:
        return uow.users.list_all()     
