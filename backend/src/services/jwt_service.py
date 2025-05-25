from flask_jwt_extended import JWTManager
from ..repositories.sqlalchemy.user_repository import UserRepository
from ..models.user_model import User

jwt = JWTManager()

@jwt.user_lookup_loader
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

