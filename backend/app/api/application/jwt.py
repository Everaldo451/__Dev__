from flask import Blueprint, request, current_app, make_response
from flask_jwt_extended import create_access_token
from flask_jwt_extended import set_access_cookies
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...db.models import User
from ...db.serializers import UserSchema
from .courses import courses_list



jwt = Blueprint('jwt',__name__,url_prefix="/jwt")


@jwt.route("/getuser",methods=["POST"])
@jwt_required(locations="cookies")
def getuser():

    identity = get_jwt_identity()

    user = User.query.filter_by(id=identity).first()

    user_schema = UserSchema()

    serialized_user = user_schema.dump(user)

    print(serialized_user)
    return serialized_user

    return {"user":{"username":user.username,"email":user.email,"courses": courses,"user_type":user.user_type.value}}


@jwt.route('/refresh_token',methods=["POST"])
@jwt_required(refresh=True, locations="cookies")
def refresh_token():

    response = make_response()
    print("ola")

    identity = get_jwt_identity()
    print(identity)
    access_token = create_access_token(identity=identity)
    set_access_cookies(response, access_token)

    return response
