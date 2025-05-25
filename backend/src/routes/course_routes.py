from flask import request as flask_request
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user

from ..models.user_model import UserTypes
from ..decorators.verify_permission import verify_user_permissions
from ..parsers.courses import CreateCourseParser, CourseArgsParser
from ..controllers.courses import CourseController

from ..repositories.sqlalchemy.course_repository import CourseRepository
from ..services.persistence.db_service import SQLAlchemyService
from ..adapters.request_adapter import RequestAdapter

from ..api import course_reponse, courses_response

import logging



course_controller = CourseController(SQLAlchemyService(), CourseRepository())
api = Namespace("courses", path="/courses")

@api.route("")
class CourseList(Resource):

    logger=logging.getLogger("endpoint_logger")

    @jwt_required(locations='cookies')
    @verify_user_permissions(
        [UserTypes.ADMIN, UserTypes.TEACHER], 
        "Students cannot create a course."
    )
    @api.marshal_with(course_reponse)
    @api.expect(CreateCourseParser)
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security="accessJWT")
    def post(self):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return course_controller.create_course(request)


@api.route("/<int:id>")
@api.doc(params={"id": "A course id."})
class Courses(Resource):

    logger=logging.getLogger("endpoint_logger")
    
    @api.doc(security="accessJWT")
    def get(self, id):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return course_controller.get_course(request, id)

    @verify_user_permissions([UserTypes.TEACHER, UserTypes.ADMIN])
    @jwt_required(locations='cookies')
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security="accessJWT")
    def delete(self, id):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return course_controller.delete_course(request, id)


@api.route("/search")
class Search(Resource):

    logger=logging.getLogger("endpoint_logger")
    
    @jwt_required(locations="cookies", optional=True)
    @api.marshal_with(courses_response)
    @api.expect(CourseArgsParser)
    def get(self):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return course_controller.custom_course_search(request)

