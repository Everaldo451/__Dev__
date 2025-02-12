from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user
from ..models.user_model import UserTypes
from ..models.course_model import Course
from ..db import db
from ..utils.filter_courses import filter_courses
from ..utils.search_course_filters import add_user_is_current_filter, add_name_filter, add_price_filter, add_language_filter
from ..decorators.verify_permission import verify_user_permissions
from ..parsers.courses import CourseArgsBaseParser
from ..api import courses_response, user_serializer
import logging

api = Namespace("me", path="/me")

@api.route("")
class Me(Resource):

    logger=logging.getLogger("endpoint_logger")

    @jwt_required(locations=["cookies"])
    @api.marshal_with(user_serializer)
    @api.doc(security="accessJWT")
    def get(self):
        self.logger.info("Sending response with current user data, status 200.")
        return current_user
    
@api.route("/courses")
class MeCourseList(Resource):

    logger=logging.getLogger("endpoint_logger")

    @jwt_required(locations=["cookies"])
    @api.marshal_with(courses_response)
    @api.expect(CourseArgsBaseParser)
    @api.doc(security="accessJWT")
    def get(self):
        self.logger.info("Starting current user courses search route.")
        args = CourseArgsBaseParser.parse_args()
        filters = []

        add_user_is_current_filter(current_user, filters)
        add_name_filter(args.get("name"), filters)
        result = add_price_filter(args.get("price"), filters)
        if result.get("error"):
            return {"message": result.get("message")}, result.get("status")
        
        add_language_filter(args.get("language"), filters)

        length = args.get("length")
        try:
            self.logger.info("Filtering the courses.")
            response = filter_courses(filters, length)
            self.logger.info("Returning response with status 200. Courses searched succesful.")

            return response
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500
    

@api.route("/courses/<int:id>")
@api.doc(params={'id': 'A course id that user is registered.'})
class MeCourse(Resource):

    logger=logging.getLogger("endpoint_logger")

    @verify_user_permissions(
        [UserTypes.STUDENT, UserTypes.ADMIN],
        "Teacher cannot subscribe a course."
    )
    @jwt_required(locations=["cookies"])
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security="accessJWT")
    def patch(self, id):
        self.logger.info("Starting current user courses add route.")
        course = None
        try:
            self.logger.info("Searching course by id.")
            course = db.session.get(Course, id)
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500
    
        self.logger.info("Verifying if course exists.")
        if course is None:
            self.logger.info("Sending response with status 404. Course don't exists.")
            return {"message":"Course not found."}, 404
    
        try:
            current_user.courses.add(course)
            self.logger.info("Adding course to current user courses.")
            db.session.commit()
            self.logger.info("Sending response with status 200. Course added succesful.")
            return {"message":"User subscribed successful."}, 200
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500
        

    @jwt_required(locations=["cookies"])
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security="accessJWT")
    def delete(self, id):

        course = None
        try: 
            self.logger.info("Searching course by id.")
            course = db.session.get(Course, id)
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500
    
        self.logger.info("Verifying if course exists.")
        if course is None:
            self.logger.info("Sending response with status 404. Course don't exists.")
            return {"message":"Course not found."}, 404
    
        self.logger.info("Verifying if current user has course.")
        if not course in current_user.courses:
            self.logger.info("Sending response with status 403. User don't have the course.")
            return {"message":"User don't have this course"}, 403
    
        try:
            self.logger.info("Removing course from current user courses.")
            current_user.courses.remove(course)
            db.session.commit()
            self.logger.info("Sending response with status 200. Course removed succesful.")
            return {"message":"User unsubscribed sucessful."}, 200
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500
