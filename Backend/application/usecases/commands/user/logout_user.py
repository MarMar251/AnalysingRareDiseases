from dataclasses import dataclass
from datetime import datetime, timezone
from domain.interfaces.unit_of_work import IUnitOfWork

@dataclass(slots=True)
class LogoutUserCommand:
    jti: str          
    expires_at: int   

def logout_user(cmd: LogoutUserCommand, uow: IUnitOfWork) -> None:
    with uow:
        uow.token_blacklist.add(
            jti=cmd.jti,
            expires_at=datetime.fromtimestamp(cmd.expires_at, tz=timezone.utc),
        )
        uow.commit()