from flask import Blueprint, request
from flask_jwt_extended import jwt_required, current_user
from ..models.user_model import User, UserTypes
from ..models.course_model import Course, Languages
from ..db import db
from ..serializers.user_serializer import UserSchema
from ..forms.courses import CourseQueryStringBase
from ..utils.courses.filter_courses import filter_courses
import logging

me = Blueprint("me",__name__,url_prefix="/me")

@me.route("",methods=["GET"])
@jwt_required(locations=["cookies"])
def get_me():
    return UserSchema().dump(current_user), 200

@me.route("/courses", methods=["GET"])
@jwt_required(locations=["cookies"])
def get_me_courses():
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
    try:
        return filter_courses(filters, length)
    except Exception as error:
        print(error)
        return {"message":"Internal server error."}, 500
    

@me.route("/courses/<int:id>", methods=["PATCH"])
@jwt_required(locations=["cookies"])
def add_course(id):
    if current_user.user_type == UserTypes.TEACHER:
        return {"message":"Teacher cannot subscribe a course"}, 403
    
    course = None
    try:
        course = db.session.get(Course, id)
    except Exception as error:
        return {"message":"Internal server error."}, 500
    
    if course is None:
        return {"message":"Course not found."}, 404
    
    try:
        current_user.courses.add(course)
        db.session.commit()
        return {"message":"User subscribed successful."}, 200
    except Exception as error:
        return {"message":"Internal server error."}, 500


@me.route("/courses/<int:id>", methods=["DELETE"])
@jwt_required(locations=["cookies"])
def remove_course(id):

    course = None
    try: 
        course = db.session.get(Course, id)
    except Exception as error:
        return {"message":"Internal server error."}, 500
    
    if course is None:
        return {"message":"Course not found."}, 404
    
    if not course in current_user.courses:
        return {"message":"User don't have this course"}, 403
    
    try:
        current_user.courses.remove(course)
        db.session.commit()
        return {"message":"User unsubscribed sucessful."}, 200
    except Exception as error:
        return {"message":"Internal server error."}, 500
    