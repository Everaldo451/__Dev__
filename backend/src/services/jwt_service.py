from ..repositories.sqlalchemy.user_repository import UserRepository
from ..models.user_model import User
from ..repositories import IRepository

def create_token_blocklist_loader(persistence_repository:IRepository):
    def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
        jti = jwt_payload["jti"]
        token = persistence_repository.get(jti)
        return token is not None
    
    return check_if_token_revoked


def user_loader(jwt_header:dict, jwt_payload:dict) -> User|None:
    sub = jwt_payload.get("sub")
    if not isinstance(sub, str)  or not sub.isdigit():
        return None
    
    id = int(sub)
    try:
        user_repository=UserRepository()
        return user_repository.get(id)
    except Exception as error: 
        return None

