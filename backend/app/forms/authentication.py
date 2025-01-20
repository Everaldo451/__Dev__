from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, EmailField
from wtforms.widgets import CheckboxInput
from wtforms.validators import DataRequired

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