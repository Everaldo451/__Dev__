from flask import Blueprint, session,request, redirect
from flask_wtf.csrf import CSRFProtect, CSRFError, generate_csrf
from ..application.jwt import jwt_authorization_verify

csrf = CSRFProtect()

csrf_routes = Blueprint("csrf",__name__,url_prefix="/csrf")

@csrf_routes.errorhandler(CSRFError)
def error(e):
    
    return {"error":"error"}


@csrf_routes.route("/get",methods=["GET"])
def get():

    if request.headers.get("Origin"):

        return {"csrf":generate_csrf()}
    
    else:
        
        print(request.args)
        return redirect("http://localhost:5173")
    


@csrf_routes.route("/post",methods=["GET"])
@jwt_authorization_verify
def post():

    return redirect("http://localhost:5173")
