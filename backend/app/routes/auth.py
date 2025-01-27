from flask import Blueprint, make_response
from flask_jwt_extended import create_access_token, set_access_cookies
from flask_jwt_extended import jwt_required, unset_jwt_cookies, current_user
from ..models.user_model import User
from ..forms.authentication import LoginForm
from ..utils.jwt.response_with_tokens import create_response_all_tokens
import logging

#Authentication Blueprint
auth = Blueprint("auth",__name__,url_prefix="/auth")

@auth.route("/signin",methods=["POST"])
def sign_in():

    form = LoginForm()
    if not form.validate_on_submit():
        return {"message":"Invalid credentials."}, 400

    user = User.authenticate(email=form.email.data, password=form.password.data)
    if user is None:
        return {"message":"Invalid email or password."}, 400
    
    try: 
        return create_response_all_tokens(str(user.id), "Login successful.", 200)
    except Exception as e: 
        return {"message": "Internal server error."}, 500

    
@auth.route("/logout",methods=["GET"])
@jwt_required(locations="cookies")
def logout():
    response = make_response()
    response.status_code = 204
    unset_jwt_cookies(response)
    return response


@auth.route("/refresh", methods=["POST"])
@jwt_required(locations=["cookies"], refresh=True)
def refresh_token():
    response = make_response(None,200)
    access_token = create_access_token(identity=str(current_user.id))
    set_access_cookies(response, access_token)
    return response