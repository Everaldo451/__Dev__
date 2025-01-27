from flask import Blueprint
from flask_jwt_extended import jwt_required, current_user
from ..models.user_model import User, UserTypes
from ..db import db
from ..serializers.user_serializer import UserSchema
from ..serializers.course_serializer import CourseSchema
from ..forms.authentication import RegisterForm, TeacherRegisterForm
from ..utils.jwt.response_with_tokens import create_response_all_tokens
import logging

users = Blueprint('users',__name__,url_prefix="/users")

@users.route("",methods=["GET"])
@jwt_required(locations=["cookies"])
def get_users():
    if current_user.user_type != UserTypes.ADMIN:
        return {"message":"Unauthorized"}, 403
    
    return UserSchema().dump(User.query.all(), many=True), 200


@users.route("/<int:id>",methods=["GET"])
@jwt_required(locations=["cookies"])
def get_user(id):
    user=None
    try: 
        user=db.session.get(User, id)
    except Exception as error:
        return {"message":"Internal server error."}, 500
    
    if user is None:
        return {"message":"User don't exists."}, 404
    
    return UserSchema().dump(user), 200


@users.route("/<int:id>", methods=["DELETE"])
@jwt_required(locations=["cookies"])
def delete_user(id):
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
        db.session.delete(user)
        db.session.commit()
        return {"message":"User deleted succesful."}, 200
    except:
        return {"message":"Internal server error"}, 500


@users.route("",methods=["POST"])
def post_user():
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
        db.session.add(user)
        db.session.commit()

        return create_response_all_tokens(str(user.id), "User created successful.", 200)
    except ValueError as error: 
        return {"message": "Last name isn't present."}, 400
    except KeyError as error:
        return {"message": "Last name isn't present."}, 400
    except Exception as error:
        return {"message": "Internal server error."}, 500