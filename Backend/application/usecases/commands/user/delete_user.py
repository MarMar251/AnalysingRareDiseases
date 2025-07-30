# application/usecases/commands/patients/delete_patient.py
from domain.interfaces.unit_of_work import IUnitOfWork
from application.usecases.errors import UserNotFoundError


def delete_user(uow: IUnitOfWork, user_id: int) -> None:
    if not uow.users.get_by_id(user_id):
        raise UserNotFoundError
    uow.users.delete(user_id)
    uow.commit()
