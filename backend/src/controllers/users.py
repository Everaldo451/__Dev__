from sqlalchemy.exc import SQLAlchemyError

from ..models.user_model import UserTypes
from ..utils.response_with_tokens import create_response_all_tokens
from ..parsers.authentication import RegisterParser
from ..types.request import Request
from ..types.response import Response
from ..repositories import IRepository

import logging

class UserController:

    logger=logging.getLogger("endpoint_logger")

    def __init__(self, user_repository:IRepository):
        self.user_repository=user_repository


    def get_all_users(self, request:Request) -> Response:
        self.user_repository.connect()
        return self.user_repository.get_all(), 200
    

    def create_user(self, request:Request) -> Response:
        self.logger.info("Starting user register route.")
        args = RegisterParser.parse_args()
        self.user_repository.connect()

        try:
            self.logger.info("Verifying if user with unique email exists.")
            if self.user_repository.filter_by(email=args.get("email")):
                return {"message": "Current email is already registered."}, 400
        except SQLAlchemyError as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message": "Internal server error."}, 500

        self.logger.info("Verifying if the user want to be a student or a teacher.")
        if args.get("is_teacher"):
            user_type = UserTypes.TEACHER
        else:
            user_type = UserTypes.STUDENT
    
        try:
            first_name, last_name = args.get("full_name").split(maxsplit=1)
            user = self.user_repository.create(
                email=args.get("email"),
                password=args.get("password"),
                first_name=first_name,
                last_name=last_name,
                user_type=user_type
            )

            self.logger.debug(f"user value: {user}")
            self.logger.info("Sending response with status 200. User created successful.")
            return create_response_all_tokens(str(user.id), "User created successful.", 200, self.logger)
        except ValueError as error: 
            message="Last name isn't present."
            self.logger.info(f"Response with status 400. Reason:{error}")
            return {"message": message}, 400
        except KeyError as error:
            message="Last name isn't present."
            self.logger.info(f"Response with status 400. Reason:{error}")
            return {"message": message}, 400
        except SQLAlchemyError as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message": "Internal server error."}, 500
        

    def get_user(self, request:Request, id:int) -> Response:
        self.logger.info("Starting get user by id route.")
        user=None
        try: 
            self.user_repository.connect()
            self.logger.info("Searching user by id.")
            user = self.user_repository.get(id)
        except SQLAlchemyError as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500
    
        if user is None:
            self.logger.info("Sending response with status 404. User don't exists.")
            return {"message":"User don't exists."}, 404
    
        self.logger.info("Sending response with status 200. User fetched successful.")
        return user, 200


    def delete_user(self, request:Request, id:int) -> Response:
        self.logger.info("Starting delete user by id route.")
        user=None
        try:
            self.user_repository.connect()
            user = self.user_repository.get(id)
        except SQLAlchemyError as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500
    
        if user is None:
            self.logger.info("Sending response with status 404. User don't exists.")
            return {"message":"User don't exists."}, 404
    
        if request.user.user_type != UserTypes.ADMIN:
            self.logger.info("Sending response with status 403. User isn't admin.")
            return {"message":"Unauthorized."}, 403
    
        try:
            self.user_repository.delete(user)
            self.logger.info("Sending response with status 200. User deleted succesful.")
            return {"message":"User deleted succesful."}, 200
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error"}, 500
