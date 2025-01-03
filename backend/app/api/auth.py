from flask import Blueprint, redirect, request, make_response
from flask_jwt_extended import create_refresh_token
from flask_jwt_extended import set_refresh_cookies
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import unset_jwt_cookies
from ..db.models import User, UserTypes, db
from .forms import RegisterForm, LoginForm, ChangeConfigsForm, TeacherRegisterForm
import logging

auth = Blueprint("auth",__name__,url_prefix="/auth")


##############AUTH

@auth.route("/login",methods=["POST"])
def login():

    form = LoginForm()

    if form.validate_on_submit():

        user = User.authenticate(email=form.email.data, password=form.password.data)

        if user is not None:

            try:

                response = make_response({"message":"Login successful."})
                response.status_code = 200

                refresh_token = create_refresh_token(identity=user.id)
                set_refresh_cookies(response,refresh_token)

                return response
        
            except Exception as e: 
            
                return {"message": "Internal server error."}, 500
    
        return {"message": "Invalid email or password."}, 400
    
    return {"message": "Invalid credentials."}, 400


@auth.route("/register",methods=["POST"])
def register():
    logging.basicConfig(level="DEBUG")

    user_type = UserTypes.STUDENT
    form = RegisterForm()
    teacher_form = TeacherRegisterForm()

    if not form.validate_on_submit():
        return {"message": "Invalid credentials."}, 400

    user = User.query.filter_by(email=form.email.data).first()

    if user:
        return {"message": "Current email is already registered."}, 400
    
    if teacher_form.validate_on_submit():
        user_type = UserTypes.TEACHER
    
    try:

        full_name = form.full_name.data
        splitted_name = full_name.split(maxsplit=1)

        first_name = splitted_name[0]
        last_name = splitted_name[1]

        user = User(
            email=form.email.data,
            password=form.password.data,
            first_name=first_name,
            last_name = last_name,
            user_type=user_type
        )

        db.session.add(user)
        db.session.commit()

        response = make_response({"message": "User created successful."})
        response.status_code = 200
        
        refresh_token = create_refresh_token(identity=user.id)
        set_refresh_cookies(response,refresh_token)

        return response
    
    except IndexError: 
        return {"message": "Last name isn't present."}, 500
    except:
        return {"message": "Internal server error."}, 500
    
@auth.route("/logout",methods=["GET"])
@jwt_required(locations="cookies")
def logout():

    response = make_response()
    response.status_code = 204
    
    unset_jwt_cookies(response)

    return response


@auth.route("/change_configs",methods=["POST"])
@jwt_required(locations='cookies')
def change_configs():

    form = ChangeConfigsForm()

    if form.validate_on_submit():

        user = User.query.get(get_jwt_identity())

        if user.email != form.email.data:

            user.email == form.email.data
    
        if user.first_name != form.first_name.data:

            user.first_name = form.first_name.data
        
        db.session.commit()

        return redirect(request.origin)
    
    else: return redirect(request.origin)
