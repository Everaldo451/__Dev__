from flask import make_response
from flask_restx import Namespace, Resource
from flask_jwt_extended import create_access_token, set_access_cookies
from flask_jwt_extended import jwt_required, unset_jwt_cookies, current_user
from ..models.user_model import User
from ..utils.response_with_tokens import create_response_all_tokens
from ..parsers.authentication import sigin_in_parser
import logging

#Authentication Blueprint
api = Namespace("auth", path="/auth")

@api.route("/signin")
class Signin(Resource):

    logger=logging.getLogger("endpoint_logger")

    @api.expect(sigin_in_parser)
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security=None)
    def post(self):
        self.logger.info("Starting signin route.")

        args = sigin_in_parser.parse_args(strict=True)
        self.logger.info("User authentication.")

        user = User.authenticate(email=args.get("email"), password=args.get("password"))
        if user is None:
            self.logger.info("Sending response with status 400. Reason: Invalid request arguments.")

            return {"message":"Invalid email or password."}, 400
    
        try: 
            self.logger.info("Sending response with status 200. Signin sucessfull.")
            return create_response_all_tokens(str(user.id), "Login successful.", 200, self.logger)
        except Exception as error: 
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message": "Internal server error."}, 500


@api.route("/logout")
class Signout(Resource):

    logger=logging.getLogger("endpoint_logger")

    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security=None)
    def post(self):
        self.logger.info("Starting signout route.")

        response = make_response()
        response.status_code = 204
        self.logger.info("Unset JWT cookies.")
        unset_jwt_cookies(response)
        self.logger.info("Sending response with status 204.")
        return response
    

@api.route("/refresh")
class RefreshToken(Resource):

    logger=logging.getLogger("endpoint_logger")

    @jwt_required(locations=["cookies"], refresh=True)
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security="refreshJWT")
    def post(self):
        self.logger.info("Starting refresh token route.")

        response = make_response()
        response.status_code = 200

        self.logger.info("Refreshing token.")
        access_token = create_access_token(identity=str(current_user.id))
        self.logger.info("Set access token cookie.")
        set_access_cookies(response, access_token)

        self.logger.info("Sending response with status 200. Token refreshed succesful.")
        return response