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
        self.logger.info("Starting create course route.")
        args = CreateCourseParser.parse_args()
        course = None

        self.logger.info("Verifying if the couse exists.")
        try:
            course = Course.query.filter_by(name=args.get("name")).first()
        except SQLAlchemyError as error:
            self.logger.error(f"Internal server error with status 500. Reason: {error}")
            return {"message":"Internal server Error"}, 500
    
        if course is not None:
            self.logger.info("Sending response with status 400. Course exists.")
            return {"message":"Course with the current name already exists."}, 400
    
        self.logger.info("Starting course creation.")
        error = None
        buffer = io.BytesIO()
        try:
            self.logger.info("Processing the image file.")

            f = args.get("image")
            f.save(buffer)
            buffer.seek(0)
            image = buffer.getvalue()
            mime = magic.Magic(True)
            mime_type = mime.from_buffer(image)

            self.logger.info("Verifying if language is valid.")
            lang = Languages(args.get("language"))

            self.logger.info("Creating course instance.")
            newCourse = Course(
                name=args.get("name"), 
                language=lang, 
                description=args.get("description"),
                price=args.get("price"),
                image=image,
                image_mime_type=mime_type
            )
            newCourse.users.add(current_user)

            self.logger.info("Registering course in database.")
            newCourse.create()

            self.logger.info("Response with status 200.")
            response, status = {
                "message":"Course created sucessfully.",
                "course":newCourse
            }, 200
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            response, status = {"message": "Ola"}, 500
        except SQLAlchemyError as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            response, status = {"message": "Invalid user"}, 500 

        if error is not None:
            db.session.rollback()

        buffer.close()
        self.logger.info("Sending the response")
        return response, status


@api.route("/<int:id>")
@api.doc(params={"id": "A course id."})
class Courses(Resource):

    logger=logging.getLogger("endpoint_logger")
    
    @api.doc(security="accessJWT")
    def get(self, id):pass

    @verify_user_permissions([UserTypes.TEACHER, UserTypes.ADMIN])
    @jwt_required(locations='cookies')
    @api.header("X-CSRFToken", "A valid csrf token.")
    @api.doc(security="accessJWT")
    def delete(self, id):
        self.logger.info("Starting course delete route.")
        course=None
        try:
            self.logger.info("Searching course by id.")
            course = db.session.get(Course,id)
        except SQLAlchemyError as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error"}, 500
    
        self.logger.info("Verifying course exists.")
        if course is None:
            self.logger.info("Sending response with status 404. Course don't exists.")
            return {"message":"The current course don't exists."}, 404
        
        try:
            self.logger.info("Delete the course.")
            course.delete()
        except SQLAlchemyError() as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error"}, 500
        
        self.logger.info("Returning response with status 200. Course deleted succesful.")
        return {"message":"Course deleted succesful."}, 200


@api.route("/search")
class Search(Resource):

    logger=logging.getLogger("endpoint_logger")
    
    @jwt_required(locations="cookies", optional=True)
    @api.marshal_with(courses_response)
    @api.expect(CourseArgsParser)
    def get(self):
        self.logger.info("Start course search")   
        args = CourseArgsParser.parse_args()
        filters = []

        add_user_is_not_current_filter(current_user, filters)
        add_name_filter(args.get("name"), filters)
        result = add_price_filter(args.get("price"), filters)
        if result.get("error"):
            return {"message": result.get("message")}, result.get("status")
            
        add_language_filter(args.get("language"), filters)

        length = args.get("length")
        try:
            self.logger.info("Filtering the courses.")
            response = filter_courses(filters, length)
            print(f"filtered courses:{response}")
            self.logger.info("Returning response with status 200. Courses searched succesful.")

            return response
        except Exception as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error."}, 500


