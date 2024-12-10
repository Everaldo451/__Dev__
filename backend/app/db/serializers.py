from .models import User, Course
from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
import base64


class CourseSchema(SQLAlchemySchema):

    class Meta:
        model = Course

    name = auto_field()
    description = auto_field()
    language = auto_field()
    image = fields.Method("get_image")

    def get_image(self, obj):
        if obj.image:
            return 'data:image/jpeg;base64,' + base64.b64encode(obj.image).decode("utf-8")
        return None
    
    #students = auto_field()
    #teachers = auto_field()


class UserSchema(SQLAlchemySchema):

    class Meta:
        model = User
    
    username = auto_field()
    email = auto_field()
    user_type = auto_field()
    courses = fields.Nested(CourseSchema, many=True)