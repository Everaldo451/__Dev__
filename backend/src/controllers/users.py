from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user
from ..models.user_model import User, UserTypes
from ..db import db
from ..utils.response_with_tokens import create_response_all_tokens
from ..decorators.verify_permission import verify_user_permissions
from ..serializers.user_serializer import UserSerializer
from ..parsers.authentication import RegisterParser
import logging

api = Namespace("users", path="/users")
model = api.model("User", UserSerializer)

@api.route("")
class UserList(Resource):

    @verify_user_permissions([UserTypes.ADMIN])
    @jwt_required(locations=["cookies"])
    @api.marshal_with(model, as_list=True)
    def get(self):
        return User.query.all(), 200
    
    def post(self):
        logging.basicConfig(level="DEBUG")

        args = RegisterParser.parse_args()
        if User.query.filter_by(email=args.get("email")).first():
            return {"message": "Current email is already registered."}, 400

        if args.get("is_teacher"):
            user_type = UserTypes.TEACHER
        else:
            user_type = UserTypes.STUDENT
    
        try:
            first_name, last_name = args.get("full_name").split(maxsplit=1)

            user = User(
                email=args.get("email"),
                password=args.get("password"),
                first_name=first_name, 
                last_name=last_name, 
                user_type=user_type
            )
            user.create()
            return create_response_all_tokens(str(user.id), "User created successful.", 200)
        except ValueError as error: 
            return {"message": "Last name isn't present."}, 400
        except KeyError as error:
            return {"message": "Last name isn't present."}, 400
        except Exception as error:
            return {"message": "Internal server error."}, 500


@api.route("/<int:id>")
class Users(Resource):

    @jwt_required(locations=["cookies"])
    @api.marshal_with(model)
    def get(self, id):
        user=None
        try: 
            user=db.session.get(User, id)
        except Exception as error:
            return {"message":"Internal server error."}, 500
    
        if user is None:
            return {"message":"User don't exists."}, 404
    
        return user, 200
    
    @jwt_required(locations=["cookies"])
    def delete(self, id):
        user=None
        try:
            user = db.session.get(User,id)
        except Exception as error:
            return {"message":"Internal server error."}, 500
    
        if user is None:
            return {"message":"User don't exists."}, 404
    
        if current_user.user_type != UserTypes.ADMIN:
            return {"message":"Unauthorized."}, 403
    
        try:
            user.delete()
            return {"message":"User deleted succesful."}, 200
        except:
            return {"message":"Internal server error"}, 500
