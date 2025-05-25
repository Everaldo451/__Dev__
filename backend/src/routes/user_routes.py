from flask import request as flask_request
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user
from ..models.user_model import UserTypes
from ..repositories.user_repository import UserRepository
from ..decorators.verify_permission import verify_user_permissions
from ..api import user_serializer
from ..parsers.authentication import RegisterParser
from ..controllers.users import UserController
from ..adapters.request_adapter import RequestAdapter

user_controller=UserController(UserRepository())
api = Namespace("users", path="/users")

@api.route("")
class UserList(Resource):

    @verify_user_permissions([UserTypes.ADMIN])
    @jwt_required(locations=["cookies"])
    @api.marshal_with(user_serializer, as_list=True)
    @api.doc(security="accessJWT")
    def get(self):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return user_controller.get_all_users(request)
    
    @api.expect(RegisterParser)
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security=None)
    def post(self):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return user_controller.create_user(request)


@api.route("/<int:id>")
@api.doc(params={'id': 'A user id.'})
class Users(Resource):

    @jwt_required(locations=["cookies"])
    @api.marshal_with(user_serializer)
    @api.doc(security="accessJWT")
    def get(self, id):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return user_controller.get_user(request, id)
    
    
    @jwt_required(locations=["cookies"])
    @api.header("X-CSRF-TOKEN", "A valid csrf token.")
    @api.doc(security="accessJWT")
    def delete(self, id):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return user_controller.delete_user(request, id)