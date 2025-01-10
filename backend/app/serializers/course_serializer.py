from ..models.course_model import Course
from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
import base64

class CourseSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = Course
        load_instance = True
        exclude = ("users",)

    image = fields.Method("get_image")
    student_count = fields.Integer()
    teachers = fields.Method("get_teachers")
    language = fields.Method("get_language")
    
    def get_language(self, obj):
        if obj.language:
            return obj.language.value

    def get_teachers(self, obj):
        if isinstance(obj.teachers,str):
            return [obj.teachers]
        return obj.teachers

    def get_image(self, obj):
        if obj.image:
            return "data:image/jpeg;base64," + base64.b64encode(obj.image).decode("utf-8")
        return None