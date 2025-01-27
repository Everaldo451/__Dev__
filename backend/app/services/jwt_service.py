from flask_jwt_extended import JWTManager
from ..models.user_model import User
from ..db import db

JWT = JWTManager()

@JWT.user_lookup_loader
def user_loader(jwt_header:dict, jwt_payload:dict) -> User|None:
    sub = jwt_payload.get("sub")
    if not isinstance(sub, str)  or not sub.isdigit():
        return None
    
    id = int(sub)
    try:
        return db.session.get(User, jwt_payload.get("sub"))
    except Exception as error: 
        return None

