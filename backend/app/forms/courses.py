from flask_wtf import FlaskForm
from flask_wtf.file import FileRequired, FileField, FileAllowed
from wtforms import StringField, IntegerField
from wtforms.widgets import TextArea
from wtforms.validators import DataRequired, AnyOf, Optional, NumberRange
from ..models.course_model import Languages


class CreateCourseForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    language = StringField(
        'language', 
        validators=[
            DataRequired(), 
            AnyOf([language.value for language in Languages],"Invalid language.")
        ]
    )
    description = StringField('description', validators=[DataRequired()], widget=TextArea)
    image = FileField('image', validators=[
        FileRequired(),
        FileAllowed(["jpeg", "png", "jpg"])
    ],)

class CourseQueryStringBase(FlaskForm):
    lang = StringField(
        'lang',
        validators=[Optional(), AnyOf([language.value for language in Languages],"Invalid language.")]
    )
    length = IntegerField('length', validators=[NumberRange(min=0)])

class CourseQueryStringFilters(CourseQueryStringBase):
    name = StringField('name')