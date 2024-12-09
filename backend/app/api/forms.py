from flask_wtf import FlaskForm
from flask_wtf.file import FileRequired, FileField, FileAllowed
from wtforms import StringField, PasswordField, EmailField
from wtforms.widgets import CheckboxInput, TextArea
from wtforms.validators import DataRequired

class AuthBaseForm(FlaskForm):

    username = StringField('username', validators=[DataRequired()])
    email = EmailField('email', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])


class RegisterForm(AuthBaseForm):
    pass


class TeacherRegisterForm(RegisterForm):

    is_teacher = StringField('is_teacher', widget=CheckboxInput)


class LoginForm(AuthBaseForm):
    username = None



class ChangeConfigsForm(AuthBaseForm):
    password = None



class CreateCourseForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    language = StringField('language', validators=[DataRequired()])
    description = StringField('description', validators=[DataRequired()], widget=TextArea)
    image = FileField('image', validators=[
        FileRequired(),
        FileAllowed(["jpeg", "png", "jpg"])
    ],)