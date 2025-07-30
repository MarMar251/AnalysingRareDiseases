from passlib.context import CryptContext
from domain.interfaces.security.password_hasher import IPasswordHasher

_pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


class BcryptHasher(IPasswordHasher):
    def hash(self, plain_password: str) -> str:
        return _pwd_ctx.hash(plain_password)

    def verify(self, plain_password: str, hashed_password: str) -> bool:
        return _pwd_ctx.verify(plain_password, hashed_password)
