from ..models.user_model import User
from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from .course_serializer import CourseSchema

class UserSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = User
        load_instance = True
        exclude = ("password","id")

    user_type = fields.Method("get_user_type")
    
    def get_user_type(self, obj):
        if obj.user_type:
            return obj.user_type.value