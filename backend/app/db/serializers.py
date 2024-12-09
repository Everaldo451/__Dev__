from .models import User, Course
from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field, fields


class CourseSchema(SQLAlchemySchema):


    class Meta:
        model = Course

    name = auto_field()
    description = auto_field()
    language = auto_field()
    image = auto_field()
    students = auto_field()
    teachers = auto_field()


class UserSchema(SQLAlchemySchema):

    class Meta:
        model = User
    
    username = auto_field()
    email = auto_field()
    user_type = auto_field()
    courses = fields.Nested(CourseSchema, many=True)