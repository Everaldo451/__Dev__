from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, current_user
from ..models.user_model import User, UserTypes
from ..models.course_model import Course, Languages
from ..db import db
from ..utils.filter_courses import filter_courses
from ..decorators.verify_permission import verify_user_permissions
from ..parsers.courses import CourseArgsBaseParser
from ..api import courses_response, user_serializer
import logging

api = Namespace("me", path="/me")

@api.route("")
class Me(Resource):

    @jwt_required(locations=["cookies"])
    @api.marshal_with(user_serializer)
    @api.doc(security="accessJWT")
    def get(self):
        return current_user, 200
    
@api.route("/courses")
class MeCourseList(Resource):

    @jwt_required(locations=["cookies"])
    @api.marshal_with(courses_response)
    @api.expect(CourseArgsBaseParser)
    @api.doc(security="accessJWT")
    def get(self):
        logging.basicConfig(level="DEBUG")
        args = CourseArgsBaseParser.parse_args()
        filters = []

        filters.append(Course.users.any(User.id == current_user.id))

        name = args.get("name")
        price = args.get("price")
        if name:
            filters.append(Course.name.ilike(f'%{name}%'))
        if price:
            print(price)
            try:
                min_value, max_value = price
                filters.append(Course.price>=min_value)
                filters.append(Course.price<=max_value)
            except:
                return {"message": "Invalid values."}, 400
            
        try:
            filters.append(Course.language == Languages(args.get("language")))
        except ValueError as error: pass

        length = args.get("length")
        try:
            return filter_courses(filters, length)
        except Exception as error:
            print(error)
            return {"message":"Internal server error."}, 500
    

@api.route("/courses/<int:id>")
@api.doc(params={'id': 'A course id that user is registered.'})
class MeCourse(Resource):

    @verify_user_permissions(
        [UserTypes.STUDENT, UserTypes.ADMIN],
        "Teacher cannot subscribe a course."
    )
    @jwt_required(locations=["cookies"])
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security="accessJWT")
    def patch(self, id):

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
        

    @jwt_required(locations=["cookies"])
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security="accessJWT")
    def delete(self, id):

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
