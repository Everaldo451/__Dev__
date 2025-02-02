from flask_restx import fields
from ..models.user_model import UserTypes

class UserTypeField(fields.Raw):
    def format(self, value):
        if value.value not in [user_type.value for user_type in UserTypes]:
            raise ValueError("Invalid user type.")
        
        return value.value

UserSerializer = {
    "id": fields.Integer,
    "full_name": fields.String,
    "email": fields.String,
    "user_type": UserTypeField,
    "admin": fields.Boolean
}