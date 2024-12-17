from flask import Blueprint, redirect, request, current_app, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import unset_jwt_cookies
from ..db.models import User, UserTypes, db
from .forms import RegisterForm, LoginForm, ChangeConfigsForm, TeacherRegisterForm

auth = Blueprint("auth",__name__,url_prefix="/auth")


##############AUTH

@auth.route("/login",methods=["POST"])
def login():

    form = LoginForm()

    if form.validate_on_submit():

        user = User.query.filter_by(email=request.form.get("email")).first()

        if user and check_password_hash(user.password, form.password.data):

            try:

                response = make_response({"message":"Login successfuly"})
                response.status_code = 200

                refresh_token = create_refresh_token(identity=user.id)
                set_refresh_cookies(response,refresh_token)

                return response
        
            except Exception as e: 
            
                return {"message": "Internal Server Error"}, 500
    
        return {"message": "Invalid email or password"}, 400
    
    return {"message": "Invalid credentials"}, 400


@auth.route("/register",methods=["POST"])
def register():

    user_type = UserTypes.STUDENT
    form = RegisterForm()
    teacher_form = TeacherRegisterForm()

    if not form.validate_on_submit():
        print("invalido")
        return {"message": "Invalid credentials."}, 400

    user = User.query.filter_by(email=form.email.data).first()

    if user:
        print("tem user")
        return {"message": "User with current email exists"}, 401

    
    if teacher_form.validate():
        user_type = UserTypes.TEACHER

    print(user_type)
    
    try:

        user = User(
            email=form.email.data,
            password=generate_password_hash(form.password.data),
            username=form.username.data,
            user_type=user_type
        )

        db.session.add(user)
        db.session.commit()

        response = make_response({"message": "User created sucessfully"})
        response.status_code = 200
        refresh_token = create_refresh_token(identity=user.id)
        set_refresh_cookies(response,refresh_token)

        return response
    
    except: 
        return {"message": "Internal server error"}, 500
        
    
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
    
        if user.username != form.username.data:

            user.username = form.username.data
        
        db.session.commit()

        return redirect(request.origin)
    
    else: return redirect(request.origin)
