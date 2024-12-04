from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, EmailField
from wtforms.widgets import CheckboxInput
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



