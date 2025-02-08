from flask_restx import fields
from ..models.course_model import Languages
from decimal import Decimal
import base64

class ImageField(fields.Raw):
    def format(self, value):
        image, image_mime_type = value
        return f"data:{image_mime_type};base64," + base64.b64encode(image).decode("utf-8")
    
class TeacherField(fields.Raw):
    def format(self, value):
        if isinstance(value, str):
            return [value]
        return value
    
class DecimalField(fields.Raw):
    def format(self, value):
        if isinstance(value, Decimal):
            return str(value)
        
        raise ValueError("This field should be a Decimal.")
    
class LanguageField(fields.Raw):
    def format(self, value):
        if value.value not in [language.value for language in Languages]:
            raise ValueError("Invalid user type.")
        
        return value.value

CourseSerializer = {
    "id": fields.Integer,
    "name": fields.String,
    "description": fields.String,
    "language": LanguageField,
    "image": ImageField(attribute="image_data"),
    "image_mime_type": fields.String,
    "date_created": fields.DateTime,
    "student_count": fields.Integer,
    "teachers": TeacherField,
    "price": DecimalField,
}