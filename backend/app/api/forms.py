from flask_wtf import FlaskForm, Form
from flask_wtf.file import FileRequired, FileField, FileAllowed
from wtforms import StringField, PasswordField, EmailField, IntegerField
from wtforms.widgets import CheckboxInput, TextArea
from wtforms.validators import DataRequired, AnyOf, Optional, NumberRange
from wtforms import ValidationError
from ..db.models import Languages

class AuthBaseForm(FlaskForm):

    full_name = StringField('full_name', validators=[DataRequired()])
    email = EmailField('email', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])


class RegisterForm(AuthBaseForm):
    pass


class TeacherRegisterForm(RegisterForm):

    is_teacher = StringField('is_teacher', validators=[DataRequired()], widget=CheckboxInput)


class LoginForm(AuthBaseForm):
    full_name = None



class ChangeConfigsForm(AuthBaseForm):
    password = None



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

class GetCourseQuery(FlaskForm):
    name = StringField('name')
    lang = StringField(
        'lang',
        validators=[Optional(), AnyOf([language.value for language in Languages],"Invalid language.")]
    )
    length = IntegerField('length', validators=[NumberRange(min=0)])