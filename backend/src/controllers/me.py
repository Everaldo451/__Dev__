from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user
from sqlalchemy.exc import SQLAlchemyError
from ..models.user_model import UserTypes
from ..models.course_model import Course
from ..db import db
from ..utils.filter_courses import filter_courses
from ..utils.search_course_filters import add_user_is_current_filter, add_name_filter, add_price_filter, add_language_filter
from ..decorators.verify_permission import verify_user_permissions
from ..parsers.courses import CourseArgsBaseParser
from ..parsers.user import UserConfigurationParser
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
    

    @jwt_required(locations=["cookies"])
    @api.header("X-CSRF-TOKEN", "A valid csrf token.")
    @api.expect(UserConfigurationParser)
    @api.doc(security="accessJWT")
    def patch(self):
        self.logger.info("Starting the user configuration change endpoint.")
        args = UserConfigurationParser.parse_args(strict=True)

        self.logger.info("Verifying if the user sent exactly one argument.")
        self.logger.debug(f"Arguments: {str(args)}")

        args_with_value = {key: value for key, value in args.items() if value is not None}
        if len(args_with_value)!=1:
            self.logger.info("Sending response with status 400. Bad arguments.")
            return {"message": "You need to send exactly one attribute."}, 400
        
        for key, value in args_with_value.items():
            self.logger.debug(f"Key value: {key}")
            self.logger.info("Verifying if the attribute exists.")
            if not hasattr(current_user, key):
                self.logger.info("Sending response with status 400. The attribute sent don't exists.")
                return {"message": "The attribute sent don't exists."}, 400
            
            attribute_value=getattr(current_user, key)
            self.logger.info("Verifying if the current attribute value and the sent value are equal.")
            if attribute_value == value:
                continue

            self.logger.info("Modifying the attribute with the sent value.")
            setattr(current_user, key, value)
        
        try:
            db.session.commit()
            self.logger.info("Sending response with status 200. The attribute was changed successful.")
            return {"message": "The attribute was changed successful."}, 200
        except SQLAlchemyError as error:
            return {"message": f"Internal server error. Reason: \n\n {error}"}, 500
    
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
