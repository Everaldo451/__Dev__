from flask import Blueprint, redirect, request, current_app, make_response, flash
from werkzeug.security import generate_password_hash, check_password_hash
from .jwt import AccessToken, RefreshToken, jwt_authorization_required
from ...models import User, db

auth = Blueprint("auth",__name__,url_prefix="/auth")

@auth.route("/getuser",methods=["GET"])
@jwt_authorization_required
def getuser():

    acess = AccessToken()

    decoded = acess.decode(request.authorization.token)

    user = User.query.filter_by(id=decoded.get("id")).first()

    return {"user":{"username":user.username,"email":user.email}}



@auth.route("/login",methods=["POST"])
def login():

    user = User.query.filter_by(email=request.form.get("email")).first()

    print(user.email)

    if user and check_password_hash(user.password, request.form.get("password")):

        try:

            access = AccessToken()
            refresh = RefreshToken()

            response = make_response(redirect(request.origin))
            response.set_cookie("access",access.encode({"id":user.id}),max_age=access.lifetime())
            response.set_cookie("refresh",refresh.encode({"id":user.id}),max_age=refresh.lifetime(),httponly=True)

            return response
        
        except Exception as e: 
            print(e)
            
            return redirect(request.origin)
    
    else: return redirect(request.origin)



@auth.route("/register",methods=["POST"])
def register():

    try:

        user = User(email=request.form.get("email"),password=generate_password_hash(request.form.get("password")),username=request.form.get("username"),admin=False)

        with current_app.app_context():
            current_app.db.session.add(user)
            current_app.db.session.commit()

        user = User.query.filter_by(email=request.form.get("email")).first()

        access = AccessToken()

        response = make_response(redirect(request.origin))
        response.set_cookie("access",access.encode({"id":user.id}),max_age=access.lifetime())


        return response
    
    except: 

        flash("Email já existente")
        return redirect(request.origin)
    
    
    
@auth.route("/logout",methods=["POST"])
@jwt_authorization_required
def logout():

    response = make_response(redirect(request.origin))
    response.set_cookie("access",None)
    response.set_cookie("refresh",None)

    return response

