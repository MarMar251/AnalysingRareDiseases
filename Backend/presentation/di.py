
from fastapi import Depends
from sqlalchemy.orm import Session

from infrastructure.db.session import get_db
from infrastructure.db.unit_of_work.sqlalchemy_uow import SqlAlchemyUnitOfWork


def get_uow(db: Session = Depends(get_db)) -> SqlAlchemyUnitOfWork:

    return SqlAlchemyUnitOfWork(db)


def get_token_service():

    from presentation.security import token_service  # lazy import
    return token_service


def get_password_hasher():

    from presentation.security import password_hasher  # lazy import
    return password_hasher
