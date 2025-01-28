from functools import wraps
from ..enums import UserTypes
from flask_jwt_extended import current_user

def verify_user_permissions(user_types:list[UserTypes], message:str|None=None):

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            if current_user and not current_user.user_type in user_types:
                return {"message":message if message else "Permission denied."}, 403
            
            return fn(*args,**kwargs)
        
        return decorator
    return wrapper