from flask import Blueprint, redirect, request, current_app, make_response, flash
from werkzeug.security import generate_password_hash, check_password_hash
from ...models import User
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import unset_jwt_cookies

auth = Blueprint("auth",__name__,url_prefix="/auth")


###################JWT

@auth.route("/getuser",methods=["GET"])
@jwt_required(locations="headers")
def getuser():

    identity = get_jwt_identity()

    user = User.query.filter_by(id=identity).first()

    return {"user":{"username":user.username,"email":user.email,"courses":user.courses}}






@auth.route('/access',methods=["POST"])
@jwt_required(locations="cookies")
def access():

    response = make_response()

    response.data = request.cookies.get(current_app.config.get("JWT_ACCESS_COOKIE_NAME"))

    return response





@auth.route("/refresh",methods=["POST"])
@jwt_required(refresh=True,locations="cookies")
def refresh():

    response = make_response()

    print("oi")

    try:

        access = create_access_token(identity=get_jwt_identity())

        set_access_cookies(response,access)

        response.data = access

        return response
    

    except: return response



##############JWT END


##############AUTH



@auth.route("/login",methods=["POST"])
def login():

    user = User.query.filter_by(email=request.form.get("email")).first()

    if user and check_password_hash(user.password, request.form.get("password")):

        try:

            response = make_response(redirect(request.origin))

            access = create_access_token(identity=user.id)
            set_access_cookies(response,access)
            refresh = create_refresh_token(identity=user.id)
            set_refresh_cookies(response,refresh)


            return response
        
        except Exception as e: 
            
            return redirect(request.origin)
    
    else: return redirect(request.origin)





@auth.route("/register",methods=["POST"])
def register():

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
        set_refresh_cookies(response,access)

        return response
    
    except: 

        flash("Email já existente")
        return redirect(request.origin)
    


    
    
@auth.route("/logout",methods=["GET"])
@jwt_required(locations="headers")
def logout():

    response = make_response()
    response.status_code = 204
    
    unset_jwt_cookies(response)

    return response

