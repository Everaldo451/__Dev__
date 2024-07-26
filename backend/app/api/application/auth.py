from flask import Blueprint, redirect, request, current_app, make_response
from werkzeug.security import generate_password_hash
from .jwt import AccessToken
from ...models import User, db

auth = Blueprint("auth",__name__,url_prefix="/auth")

@auth.route("/accessjwt",methods=["GET"])
def accessjwt():

    message = {
        "user":"user",
        "userid":"userid"
    }

    acess = AccessToken()

    return acess.encode(message)



@auth.route("/login",methods=["POST"])
def login():


    return redirect(request.origin)



@auth.route("/register",methods=["POST"])
def register():

    #UsModel = User(email=request.form.get("email"),password=generate_password_hash(request.form.get("password"),username=request.form.get("username"),admin=False))

    #current_app.db.session.add(UsModel)
    #current_app.db.session.commit()

    message = {
        "id": 1
    }

    access = AccessToken()

    response = make_response(redirect(request.host))
    response.set_cookie("access",access.encode(message),max_age=access.lifetime())


    return response

