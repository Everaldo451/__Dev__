from flask import make_response
from flask_jwt_extended import create_access_token, set_access_cookies
from flask_jwt_extended import unset_jwt_cookies, get_jwt
from ..utils.response_with_tokens import create_response_all_tokens
from ..parsers.authentication import sigin_in_parser

from ..repositories.entity import IUserRepository
from ..repositories import IRepository

from ..types.request import Request
from ..types.response import Response
import logging

class AuthenticationController:

    logger=logging.getLogger("endpoint_logger")

    def __init__(self,
                user_repository:IUserRepository,
                token_black_list_repository:IRepository
                ):
        self.user_repository = user_repository
        self.token_black_list_repository = token_black_list_repository


    def login(self, request:Request) -> Response:
        self.logger.info("Starting signin route.")

        args = sigin_in_parser.parse_args(strict=True)
        self.logger.info("User authentication.")

        user = self.user_repository.authenticate(args.get("email"), args.get("password"))
        if user is None:
            self.logger.info("Sending response with status 400. Reason: Invalid request arguments.")
            return {"message":"Invalid email or password."}, 400
    
        try: 
            self.logger.info("Sending response with status 200. Signin sucessfull.")
            return create_response_all_tokens(str(user.id), "Login successful.", 200, self.logger)
        except Exception as error: 
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message": "Internal server error."}, 500

    
    def logout(self, request:Request) -> Response:
        self.logger.info("Starting signout route.")

        response = make_response()
        response.status_code = 204
        self.logger.info("Unset JWT cookies.")
        token = get_jwt()
        token_id = token.get("jti")
        self.token_black_list_repository.create(id=token_id, value="", ex=1000)
        unset_jwt_cookies(response)
        self.logger.info("Sending response with status 204.")
        return response
    

    def refresh_jwt(self, request:Request) -> Response:
        self.logger.info("Starting refresh token route.")

        response = make_response()
        response.status_code = 200

        self.logger.info("Refreshing token.")
        access_token = create_access_token(identity=str(request.user.id))
        self.logger.info("Set access token cookie.")
        set_access_cookies(response, access_token)

        self.logger.info("Sending response with status 200. Token refreshed succesful.")
        return response