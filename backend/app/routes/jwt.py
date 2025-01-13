from flask import Blueprint, make_response
from flask_jwt_extended import create_access_token
from flask_jwt_extended import set_access_cookies
from flask_jwt_extended import jwt_required, current_user
from flask_jwt_extended import JWTManager
from ..models.user_model import User
from ..db import db
from ..serializers.user_serializer import UserSchema

JWT = JWTManager()
jwt = Blueprint('jwt',__name__,url_prefix="/jwt")

@JWT.user_lookup_loader
def user_loader(jwt_header:dict, jwt_payload:dict) -> User|None:
    id = jwt_payload.get("sub")
    if isinstance(id, int):
        try:
            return db.session.get(User, jwt_payload.get("sub"))
        except Exception as error: pass
    return None

@jwt.route("/getuser",methods=["POST"])
@jwt_required(locations="cookies")
def getuser():
    user_schema = UserSchema()
    serialized_user = user_schema.dump(current_user)
    return serialized_user


@jwt.route('/refresh_token',methods=["POST"])
@jwt_required(refresh=True, locations="cookies")
def refresh_token():
    response = make_response()
    access_token = create_access_token(identity=current_user.id)
    set_access_cookies(response, access_token)
    return response
