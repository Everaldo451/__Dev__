from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user
from ..models.user_model import User, UserTypes
from ..db import db
from ..forms.authentication import RegisterForm, TeacherRegisterForm
from ..utils.jwt.response_with_tokens import create_response_all_tokens
from ..decorators.verify_permission import verify_user_permissions
from ..serializers.user_serializer import UserSerializer
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

        form = RegisterForm()
        if not form.validate_on_submit():
            return {"message": "Invalid credentials."}, 400

        if User.query.filter_by(email=form.email.data).first():
            return {"message": "Current email is already registered."}, 400

        teacher_form = TeacherRegisterForm()
        if teacher_form.validate_on_submit():
            user_type = UserTypes.TEACHER
        else:
            user_type = UserTypes.STUDENT
    
        try:
            first_name, last_name = form.full_name.data.split(maxsplit=1)

            user = User(
                email=form.email.data,
                password=form.password.data,
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
