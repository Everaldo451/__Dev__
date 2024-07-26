from flask import Blueprint, redirect, request
from .jwt import AccessToken

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

    return redirect(request.origin)

