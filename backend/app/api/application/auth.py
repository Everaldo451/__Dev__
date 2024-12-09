from flask import Blueprint, redirect, request, current_app, make_response, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import unset_jwt_cookies
from flask_wtf.form import Form
from ...db.models import User, UserTypes, db
from ..forms import RegisterForm, LoginForm, ChangeConfigsForm, TeacherRegisterForm

auth = Blueprint("auth",__name__,url_prefix="/auth")


##############AUTH



@auth.route("/login",methods=["POST"])
def login():

    response = make_response(redirect(request.origin))

    form = LoginForm()

    if form.validate_on_submit():

        user = User.query.filter_by(email=request.form.get("email")).first()

        if user and check_password_hash(user.password, form.password.data):

            try:

                access = create_access_token(identity=user.id)
                set_access_cookies(response,access)
                refresh = create_refresh_token(identity=user.id)
                set_refresh_cookies(response,refresh)


                return response
        
            except Exception as e: 
            
                return response
    
        return response
    
    return response


@auth.route("/register",methods=["POST"])
def register():

    user_type = UserTypes.STUDENT
    form = RegisterForm()
    teacher_form = TeacherRegisterForm()

    response = make_response(redirect(request.origin))

    if not form.validate_on_submit():
        response.status_code = 400
        print("invalido")
        return response

    user = User.query.filter_by(email=form.email.data).first()

    if user:
        response.status_code = 401
        print("tem user")
        return response

    
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

        with current_app.app_context():
            db.session.add(user)
            db.session.commit()

        access = create_access_token(identity=user.id)
        set_access_cookies(response,access)
        refresh = create_refresh_token(identity=user.id)
        set_refresh_cookies(response,refresh)

        return response
    
    except: 
        return response
        
    
@auth.route("/logout",methods=["GET"])
@jwt_required(locations="headers")
def logout():

    response = make_response()
    response.status_code = 204
    
    unset_jwt_cookies(response)

    return response


@auth.route("/change_configs",methods=["POST"])
@jwt_required(locations='headers')
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
