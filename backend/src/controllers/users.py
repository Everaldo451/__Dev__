from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user
from sqlalchemy.exc import SQLAlchemyError
from ..models.user_model import User, UserTypes
from ..db import db
from ..utils.response_with_tokens import create_response_all_tokens
from ..decorators.verify_permission import verify_user_permissions
from ..api import user_serializer
from ..parsers.authentication import RegisterParser
import logging

api = Namespace("users", path="/users")

@api.route("")
class UserList(Resource):

    logger=logging.getLogger("endpoint_logger")

    @verify_user_permissions([UserTypes.ADMIN])
    @jwt_required(locations=["cookies"])
    @api.marshal_with(user_serializer, as_list=True)
    @api.doc(security="accessJWT")
    def get(self):
        return User.query.all(), 200
    
    @api.expect(RegisterParser)
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security=None)
    def post(self):
        self.logger.info("Starting user register route.")
        args = RegisterParser.parse_args()

        try:
            self.logger.info("Verifying if user with unique email exists.")
            if User.query.filter_by(email=args.get("email")).first():
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
            self.logger.info("Loading the first name and the last name.")
            first_name, last_name = args.get("full_name").split(maxsplit=1)

            self.logger.info("Creating user instance.")
            user = User(
                email=args.get("email"),
                password=args.get("password"),
                first_name=first_name, 
                last_name=last_name, 
                user_type=user_type
            )
            user.create()

            self.logger.info("Sending response with status 200. User created successful.")
            return create_response_all_tokens(str(user.id), "User created successful.", 200)
        except ValueError as error: 
            message="Last name isn't present."
            self.logger.info(f"Response with status 400. Reason:{message}")
            return {"message": message}, 400
        except KeyError as error:
            message="Last name isn't present."
            self.logger.info(f"Response with status 400. Reason:{message}")
            return {"message": message}, 400
        except SQLAlchemyError as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message": "Internal server error."}, 500


@api.route("/<int:id>")
@api.doc(params={'id': 'A user id.'})
class Users(Resource):

    logger=logging.getLogger("endpoint_logger")

    @jwt_required(locations=["cookies"])
    @api.marshal_with(user_serializer)
    @api.doc(security="accessJWT")
    def get(self, id):
        self.logger.info("Starting get user by id route.")
        user=None
        try: 
            self.logger.info("Searching user by id.")
            user=db.session.get(User, id)
        except SQLAlchemyError as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500
    
        self.logger.info("Verifying user exists.")
        if user is None:
            self.logger.info("Sending response with status 404. User don't exists.")
            return {"message":"User don't exists."}, 404
    
        return user, 200
    
    @jwt_required(locations=["cookies"])
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security="accessJWT")
    def delete(self, id):
        self.logger.info("Starting delete user by id route.")
        user=None
        try:
            self.logger.info("Searching user by id.")
            user = db.session.get(User,id)
        except SQLAlchemyError as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500
    
        self.logger.info("Verifying user exists.")
        if user is None:
            self.logger.info("Sending response with status 404. User don't exists.")
            return {"message":"User don't exists."}, 404
    
        self.logger.info("Verifying user is admin")
        if current_user.user_type != UserTypes.ADMIN:
            self.logger.info("Sending response with status 403. User isn't admin.")
            return {"message":"Unauthorized."}, 403
    
        try:
            self.logger.info("Trying to delete the user.")
            user.delete()
            self.logger.info("Sending response with status 200. User deleted succesful.")
            return {"message":"User deleted succesful."}, 200
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error"}, 500
