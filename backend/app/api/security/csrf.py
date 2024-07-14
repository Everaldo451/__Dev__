from flask import Blueprint, session,request
from flask_wtf.csrf import generate_csrf
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect()

csrf_routes = Blueprint("csrf",__name__,url_prefix="/csrf")

@csrf_routes.route("/get",methods=["GET"])
def post():

    return {"csrf":session.get("csrf_token")}


@csrf_routes.route("/post",methods=["POST"])
def get():

    for key, value in request.form.items():
        print(key+":"+value)

    csrf = generate_csrf()

    return {"csrf_token":csrf}