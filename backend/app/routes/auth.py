from flask import Blueprint, make_response
from flask_jwt_extended import create_refresh_token
from flask_jwt_extended import set_refresh_cookies
from flask_jwt_extended import jwt_required
from flask_jwt_extended import unset_jwt_cookies
from ..db import db
from ..models.user_model import User, UserTypes
from ..forms.authentication import RegisterForm, LoginForm, TeacherRegisterForm
import logging

#Authentication Blueprint
auth = Blueprint("auth",__name__,url_prefix="/auth")

@auth.route("/login",methods=["POST"])
def login():

    form = LoginForm()
    if not form.validate_on_submit():
        return {"message":"Invalid credentials."}, 400

    user = User.authenticate(email=form.email.data, password=form.password.data)
    if user is None:
        return {"message":"Invalid email or password."}, 400
    
    try: 
        response = make_response({"message":"Login successful."}, 200)
        refresh_token = create_refresh_token(identity=user.id)
        set_refresh_cookies(response,refresh_token)
        return response
    except Exception as e: 
        return {"message": "Internal server error."}, 500
            


@auth.route("/register",methods=["POST"])
def register():
    logging.basicConfig(level="DEBUG")

    form = RegisterForm()
    if not form.validate_on_submit():
        return {"message": "Invalid credentials."}, 400

    user = User.query.filter_by(email=form.email.data).first()
    if user:
        return {"message": "Current email is already registered."}, 400

    user_type = UserTypes.STUDENT
    teacher_form = TeacherRegisterForm()

    if teacher_form.validate_on_submit():
        user_type = UserTypes.TEACHER
    
    try:
        first_name, last_name = form.full_name.data.split(maxsplit=1)

        user = User(
            email=form.email.data,
            password=form.password.data,
            first_name=first_name, 
            last_name=last_name, 
            user_type=user_type
        )
        db.session.add(user)
        db.session.commit()

        response = make_response({"message": "User created successful."}, 200)
        refresh_token = create_refresh_token(identity=user.id)
        print(refresh_token)
        set_refresh_cookies(response,refresh_token)
        return response
    except ValueError as error: 
        return {"message": "Last name isn't present."}, 400
    except KeyError as error:
        return {"message": "Last name isn't present."}, 400
    except Exception as error:
        return {"message": "Internal server error."}, 500
    
@auth.route("/logout",methods=["GET"])
@jwt_required(locations="cookies")
def logout():
    response = make_response()
    response.status_code = 204
    unset_jwt_cookies(response)
    return response


"""
@auth.route("/change_configs",methods=["POST"])
@jwt_required(locations='cookies')
def change_configs():

    if form.validate_on_submit():

        user = User.query.get(get_jwt_identity())

        if user.email != form.email.data:

            user.email == form.email.data
    
        if user.first_name != form.first_name.data:

            user.first_name = form.first_name.data
        
        db.session.commit()

        return redirect(request.origin)
    
    else: return redirect(request.origin)
"""
