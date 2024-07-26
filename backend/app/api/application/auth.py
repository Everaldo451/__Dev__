from flask import Blueprint, current_app
from jwt import jwk_from_dict,jwt,JWT
from .jwt import encode

auth = Blueprint("auth",__name__,url_prefix="/auth")

@auth.route("/accessjwt",methods=["GET"])
def accessjwt():

    message = {
        "user":"user",
        "userid":"userid"
    }

    return encode(message)

