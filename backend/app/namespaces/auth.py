from flask import make_response
from flask_restx import Namespace, Resource
from flask_jwt_extended import create_access_token, set_access_cookies
from flask_jwt_extended import jwt_required, unset_jwt_cookies, current_user
from ..models.user_model import User
from ..utils.jwt.response_with_tokens import create_response_all_tokens
from ..parsers.authentication import sigin_in_parser
import logging

#Authentication Blueprint
api = Namespace("auth", path="/auth")

@api.route("/signin")
class Signin(Resource):

    def post(self):
        args = sigin_in_parser.parse_args(strict=True)
        user = User.authenticate(email=args.get("email"), password=args.get("password"))
        if user is None:
            return {"message":"Invalid email or password."}, 400
    
        try: 
            return create_response_all_tokens(str(user.id), "Login successful.", 200)
        except Exception as e: 
            return {"message": "Internal server error."}, 500


@api.route("/logout")
class Signout(Resource):

    def post(self):
        response = make_response()
        response.status_code = 204
        unset_jwt_cookies(response)
        return response
    

@api.route("/refresh")
class RefreshToken(Resource):

    @jwt_required(locations=["cookies"], refresh=True)
    def post():
        response = make_response()
        response.status_code = 200
        access_token = create_access_token(identity=str(current_user.id))
        set_access_cookies(response, access_token)
        return response