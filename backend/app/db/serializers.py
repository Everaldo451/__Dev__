from .models import User, Course
from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
import base64


class CourseSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = Course
        load_instance = True
        exclude = ("users",)

    image = fields.Method("get_image")
    student_count = fields.Integer()
    teachers = fields.Method("get_teachers")

    def get_teachers(self, obj):
        if isinstance(obj.teachers,str):
            return [obj.teachers]
        return obj.teachers

    def get_image(self, obj):
        if obj.image:
            return 'data:image/jpeg;base64,' + base64.b64encode(obj.image).decode("utf-8")
        return None
    
    #students = auto_field()
    #teachers = auto_field()


class UserSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = User
        load_instance = True
        exclude = ("password",)

    courses = fields.Nested("CourseSchema", many=True)