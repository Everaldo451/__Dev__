from flask_restx import Resource
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import SQLAlchemyError
from ..models.user_model import UserTypes
from ..db import db
from ..utils.filter_courses import filter_courses
from ..utils.search_course_filters import add_user_is_current_filter, add_name_filter, add_price_filter, add_language_filter
from ..parsers.courses import CourseArgsBaseParser
from ..parsers.user import UserConfigurationParser

from ..types.request import Request
from ..types.response import Response
from ..repositories import IRepository
import logging


class MeController:

    logger=logging.getLogger("endpoint_logger")

    def __init__(self, user_repository:IRepository, course_repository:IRepository):
        self.user_repository = user_repository
        self.course_repository = course_repository

    
    def get_me(self, request:Request) -> Response:
        self.logger.info("Starting get user own data.")
        self.logger.info("Sending response with current user data, status 200.")
        return request.user, 200
    

    def update_me(self, request:Request) -> Response:
        self.logger.info("Starting the user configuration change endpoint.")
        args = UserConfigurationParser.parse_args(strict=True)

        self.logger.info("Verifying if the user sent exactly one argument.")
        self.logger.debug(f"Arguments: {str(args)}")

        args_with_value = {key: value for key, value in args.items() if value is not None}
        if len(args_with_value)!=1:
            self.logger.info("Sending response with status 400. Bad arguments.")
            return {"message": "You need to send exactly one attribute."}, 400

        try:
            self.user_repository.connect()
            self.user_repository.update(request.user, **args_with_value)
            self.logger.info("Sending response with status 200. The attribute was changed successful.")
            return {"message": "The attribute was changed successful."}, 200
        except SQLAlchemyError as error:
            return {"message": f"Internal server error. Reason: \n\n {error}"}, 500
        except AttributeError as error:
            self.logger.info("Sending response with status 400. The attribute sent don't exists.")
            return {"message": "The attribute sent don't exists."}, 400
    
    
    def get_me_all_courses(self, request:Request) -> Response:
        self.logger.info("Starting current user courses get route.")
        try:
            courses = request.user.courses
            self.logger.info("Returning response with status 200. Courses getted succesful.")
            return courses
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500
        
    
    def custom_me_courses_search(self, request:Request) -> Response:
        self.logger.info("Starting current user courses search route.")
        args = CourseArgsBaseParser.parse_args()
        filters = []

        add_user_is_current_filter(request.user, filters)
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
    

    def add_me_course(self, request:Request, id:int) -> Response:
        self.logger.info("Starting current user courses add route.")
        course = None
        try:
            self.course_repository.connect()
            course = self.course_repository.get(id)
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500
    
        self.logger.info("Verifying if course exists.")
        if course is None:
            self.logger.info("Sending response with status 404. Course don't exists.")
            return {"message":"Course not found."}, 404
    
        try:
            request.user.courses.add(course)
            self.logger.info("Adding course to current user courses.")
            db.session.commit()
            self.logger.info("Sending response with status 200. Course added succesful.")
            return {"message":"User subscribed successful."}, 200
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500
        
    
    def remove_me_course(self, request:Request, id:int) -> Response:
        course = None
        try: 
            self.course_repository.connect()
            self.logger.info("Searching course by id.")
            course = self.course_repository.get(id)
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500
    
        self.logger.info("Verifying if course exists.")
        if course is None:
            self.logger.info("Sending response with status 404. Course don't exists.")
            return {"message":"Course not found."}, 404
    
        self.logger.info("Verifying if current user has course.")
        if not course in request.user.courses:
            self.logger.info("Sending response with status 403. User don't have the course.")
            return {"message":"User don't have this course"}, 403
    
        try:
            self.logger.info("Removing course from current user courses.")
            request.user.courses.remove(course)
            db.session.commit()
            self.logger.info("Sending response with status 200. Course removed succesful.")
            return {"message":"User unsubscribed sucessful."}, 200
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500