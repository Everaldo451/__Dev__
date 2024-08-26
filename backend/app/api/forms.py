from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, EmailField
from wtforms.validators import DataRequired

class AuthBaseForm(FlaskForm):

    username = StringField('username', validators=[DataRequired()])
    email = EmailField('email', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])




class RegisterForm(AuthBaseForm):
    pass


class LoginForm(AuthBaseForm):
    username = None



class ChangeConfigsForm(AuthBaseForm):
    password = None



