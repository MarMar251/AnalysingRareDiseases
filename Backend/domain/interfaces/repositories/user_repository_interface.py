from abc import ABC, abstractmethod
from typing import Optional
from domain.entities.user import User
from domain.value_objects.email_address import EmailAddress
from domain.interfaces.repositories.base_repository import IRepository

class IUserRepository(IRepository[User], ABC):

    @abstractmethod
    def create(self, user: User, hashed_password: str) -> User:
        pass

    @abstractmethod
    def get_by_email(self, email: EmailAddress) -> Optional[User]:
        pass

    @abstractmethod
    def update(self, user_id: int, updates: dict) -> User:
        pass
    
    @abstractmethod
    def get_by_role(self, role: str) -> list[User]:
        pass
