from flask import Blueprint
from flask_wtf.csrf import CSRFError, generate_csrf

csrf = Blueprint("csrf",__name__,url_prefix="/csrf")

@csrf.app_errorhandler(CSRFError)
def error(e):
    return {"message":"error"}, 400

@csrf.route("",methods=["GET"])
def get():
    print("accessing csrf route")
    return {"csrf":generate_csrf()}
    
    
    
