from flask import request as flask_request
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user

from ..parsers.authentication import sigin_in_parser

from ..controllers.auth import AuthenticationController
from ..repositories.sqlalchemy.user_repository import UserRepository
from ..adapters.request_adapter import RequestAdapter

from ..redis import redis_repository
import logging

auth_controller = AuthenticationController(
    UserRepository(), 
    redis_repository
    )
api = Namespace("auth", path="/auth")

@api.route("/signin")
class Signin(Resource):

    logger=logging.getLogger("endpoint_logger")

    @api.expect(sigin_in_parser)
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security=None)
    def post(self):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return auth_controller.login(request)


@api.route("/logout")
class Signout(Resource):

    logger=logging.getLogger("endpoint_logger")

    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security=None)
    def post(self):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return auth_controller.logout(request)
    

@api.route("/refresh")
class RefreshToken(Resource):

    logger=logging.getLogger("endpoint_logger")

    @jwt_required(locations=["cookies"], refresh=True)
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security="refreshJWT")
    def post(self):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return auth_controller.refresh_jwt(request)