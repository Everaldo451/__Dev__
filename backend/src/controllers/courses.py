from flask import request
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from ..models.course_model import Course, Languages
from ..models.user_model import UserTypes
from ..utils.filter_courses import filter_courses
from ..utils.search_course_filters import add_name_filter, add_price_filter, add_language_filter, add_user_is_not_current_filter
from ..decorators.verify_permission import verify_user_permissions
from ..parsers.courses import CreateCourseParser, CourseArgsParser
from ..api import course_reponse, courses_response
from ..db import db
import logging
import magic
import io

#Course Blueprint
api = Namespace("courses", path="/courses")

@api.route("")
class CourseList(Resource):

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
        logging.basicConfig(level="DEBUG")
        args = CreateCourseParser.parse_args()
        print(args)
        course = None
        try:
            course = Course.query.filter_by(name=args.get("name")).first()
        except SQLAlchemyError as error:
            return {"message":"Internal server Error"}, 500
    
        if course is not None:
            return {"message":"Course with the current name already exists."}, 400
    
        error = None
        buffer = io.BytesIO()
        try:
            f = args.get("image")
            f.save(buffer)
            buffer.seek(0)
            image = buffer.getvalue()
            mime = magic.Magic(True)
            mime_type = mime.from_buffer(image)

            lang = Languages(args.get("language"))
            newCourse = Course(
                name=args.get("name"), 
                language=lang, 
                description=args.get("description"),
                price=args.get("price"),
                image=image,
                image_mime_type=mime_type
            )
            newCourse.users.add(current_user)
            newCourse.create()

            response, status = {
                "message":"Course created sucessfully.",
                "course":newCourse
            }, 200
        except Exception as error:
            response, status = {"message": "Ola"}, 500
        except IntegrityError as error:
            response, status = {"message": "Invalid user"}, 500 

        if error is not None:
            db.session.rollback()

        buffer.close()
        return response, status


@api.route("/<int:id>")
@api.doc(params={"id": "A course id."})
class Courses(Resource):
    
    @api.doc(security="accessJWT")
    def get(self, id):pass

    @verify_user_permissions([UserTypes.TEACHER, UserTypes.ADMIN])
    @jwt_required(locations='cookies')
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security="accessJWT")
    def delete(self, id):
        course=None
        try:
            course = db.session.get(Course,id)
        except SQLAlchemyError as error:
            return {"message":"Internal server error"}, 500
    
        if course is None:
            return {"message":"The current course don't exists."}, 404
        course.delete()

        return {"message":"Course deleted succesful."}, 200


@api.route("/search")
class Search(Resource):
    
    @jwt_required(locations="cookies", optional=True)
    @api.marshal_with(courses_response)
    @api.expect(CourseArgsParser)
    def get(self):
        logging.basicConfig(level="DEBUG")    
        args = CourseArgsParser.parse_args()
        filters = []

        add_name_filter(args.get("name"), filters)
        result = add_price_filter(args.get("price"), filters)
        if result.get("error"):
            return {"message": result.get("message")}, result.get("status")
            
        add_user_is_not_current_filter(current_user, filters)
        add_language_filter(args.get("language"), filters)

        length = args.get("length")
        try:
            return filter_courses(filters, length)
        except Exception as error:
            print(error)
            return {"message":"Internal server error."}, 500


