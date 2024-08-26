from flask import Blueprint, request, current_app, make_response
from flask_jwt_extended import create_access_token
from flask_jwt_extended import set_access_cookies
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...models import User
from .courses import courses_list



jwt = Blueprint('jwt',__name__,url_prefix="/jwt")




@jwt.route("/getuser",methods=["GET"])
@jwt_required(locations="headers")
def getuser():

    identity = get_jwt_identity()

    user = User.query.filter_by(id=identity).first()

    return {"user":{"username":user.username,"email":user.email,"courses":courses_list(user.courses)}}





@jwt.route('/access',methods=["POST"])
@jwt_required(locations="cookies")
def access():

    response = make_response()

    response.data = request.cookies.get(current_app.config.get("JWT_ACCESS_COOKIE_NAME"))

    return response




@jwt.route("/refresh",methods=["POST"])
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

