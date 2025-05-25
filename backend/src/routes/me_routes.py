from flask import request as flask_request
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user

from ..models.user_model import UserTypes
from ..decorators.verify_permission import verify_user_permissions
from ..parsers.courses import CourseArgsBaseParser
from ..parsers.user import UserConfigurationParser
from ..controllers.me import MeController

from ..repositories.sqlalchemy.user_repository import UserRepository
from ..repositories.sqlalchemy.course_repository import CourseRepository
from ..services.persistence.db_service import SQLAlchemyService
from ..adapters.request_adapter import RequestAdapter

from ..api import courses_response, user_serializer
import logging

me_controller = MeController(SQLAlchemyService() ,UserRepository(), CourseRepository())
api = Namespace("me", path="/me")

@api.route("")
class Me(Resource):

    @jwt_required(locations=["cookies"])
    @api.marshal_with(user_serializer)
    @api.doc(security="accessJWT")
    def get(self):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return me_controller.get_me(request)


    @jwt_required(locations=["cookies"])
    @api.header("X-CSRF-TOKEN", "A valid csrf token.")
    @api.expect(UserConfigurationParser)
    @api.doc(security="accessJWT")
    def patch(self):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return me_controller.update_me(request)
       


@api.route("/courses")
class MeCourseList(Resource):

    @jwt_required(locations=["cookies"])
    @api.marshal_with(courses_response)
    @api.expect(CourseArgsBaseParser)
    @api.doc(security="accessJWT")
    def get(self):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return me_controller.get_me_all_courses(request)



@api.route("/courses/search")  
class MeCourseListSearch(Resource):

    @jwt_required(locations=["cookies"])
    @api.marshal_with(courses_response)
    @api.expect(CourseArgsBaseParser)
    @api.doc(security="accessJWT")
    def get(self):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return me_controller.custom_me_courses_search(request)
    


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
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return me_controller.add_me_course(request, id)
        

    @jwt_required(locations=["cookies"])
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security="accessJWT")
    def delete(self, id):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return me_controller.remove_me_course(request, id)
