from flask import Blueprint
from flask_wtf.csrf import CSRFError, generate_csrf

csrf_routes = Blueprint("csrf",__name__,url_prefix="/csrf")

@csrf_routes.app_errorhandler(CSRFError)
def error(e):
    return {"message":"error"}, 400

@csrf_routes.route("/get",methods=["GET"])
def get():
    return {"csrf":generate_csrf()}
    
    
    
