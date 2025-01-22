from flask import Blueprint, request
from flask_jwt_extended import jwt_required, current_user
from ..models.user_model import User
from ..models.course_model import Course, Languages
from ..db import db
from ..serializers.user_serializer import UserSchema
from ..serializers.course_serializer import CourseSchema
from ..forms.courses import CourseQueryStringBase
import logging
import math

user_routes = Blueprint('user',__name__,url_prefix="/user")

@user_routes.route("/",methods=["POST"])
@jwt_required(locations=["cookies"])
def getuser():
    user_schema = UserSchema()
    serialized_user = user_schema.dump(current_user)
    return serialized_user

@user_routes.route("/courses", methods=["GET"])
@jwt_required(locations="cookies")
def get_user_courses():
    logging.basicConfig(level="DEBUG")
    query_string = CourseQueryStringBase(meta={'csrf':False},formdata=request.args)
    filters = []

    if not query_string.validate():
        return {"message": "Invalid credentials."}, 400

    filters.append(Course.users.any(User.id == current_user.id))

    try:
        filters.append(Course.language == Languages(query_string.lang.data))
    except ValueError as error: pass

    length = query_string.length.data
    limit = math.ceil(length/6)*6 - length if length > 0 else 6

    try:
        courses = Course.query.filter(*filters).order_by(Course.date_created.desc()).offset(length).limit(limit).all()
        course_schema = CourseSchema()
        serialized_courses = course_schema.dump(courses, many=True)
        return {"courses":serialized_courses}, 200
    except Exception as error:
        print(error)
        return {"message":"Internal server error."}, 500