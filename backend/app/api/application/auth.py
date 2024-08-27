from flask import Blueprint, redirect, request, current_app, make_response, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import unset_jwt_cookies
from flask_wtf.form import Form
from ...models import User
from ..forms import RegisterForm, LoginForm, ChangeConfigsForm

auth = Blueprint("auth",__name__,url_prefix="/auth")


##############AUTH



@auth.route("/login",methods=["POST"])
def login():

    response = make_response(redirect(request.origin))

    form = LoginForm()

    if form.validate()==True:

        user = User.query.filter_by(email=request.form.get("email")).first()

        if user and check_password_hash(user.password, request.form.get("password")):

            try:

                access = create_access_token(identity=user.id)
                set_access_cookies(response,access)
                refresh = create_refresh_token(identity=user.id)
                set_refresh_cookies(response,refresh)


                return response
        
            except Exception as e: 
            
                return response
    
        else: return response
    
    else: return response





@auth.route("/register",methods=["POST"])
def register():

    form = RegisterForm()

    if form.validate() == True:

        try:

            user = User(
                email=request.form.get("email"),
                password=generate_password_hash(request.form.get("password")),
                username=request.form.get("username")
            )

            with current_app.app_context():
                current_app.db.session.add(user)
                current_app.db.session.commit()

            user = User.query.filter_by(email=request.form.get("email")).first()

            response = make_response(redirect(request.origin))

            access = create_access_token(identity=user.id)
            set_access_cookies(response,access)
            refresh = create_refresh_token(identity=user.id)
            set_refresh_cookies(response,refresh)

            return response
    
        except: 

            flash("Email já existente")
            return redirect(request.origin)
        
    else: return redirect(request.origin)
    


    
    
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

    if form.validate() == True:

        user = User.query.get(get_jwt_identity())

        if user.email != request.args.get("email"):

            user.email == request.args.get("email")
    
        if user.username != request.args.get("username"):

            user.username = request.args.get("username")
        
        current_app.db.session.commit()

        return redirect(request.origin)
    
    else: return redirect(request.origin)
