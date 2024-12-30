from flask import Blueprint, request, redirect
from flask_wtf.csrf import CSRFError, generate_csrf

csrf_routes = Blueprint("csrf",__name__,url_prefix="/csrf")

@csrf_routes.errorhandler(CSRFError)
def error(e):
    
    return {"message":"error"}


@csrf_routes.route("/get",methods=["GET"])
def get():

    return {"csrf":generate_csrf()}
    
    
    
