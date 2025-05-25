from sqlalchemy.exc import SQLAlchemyError

from ..models.course_model import Languages
from ..utils.filter_courses import filter_courses
from ..utils.search_course_filters import add_name_filter, add_price_filter, add_language_filter, add_user_is_not_current_filter
from ..parsers.courses import CreateCourseParser, CourseArgsParser
from ..types.request import Request
from ..types.response import Response
from ..repositories import IRepository

from ..db import db
import magic
import io

import logging

#Course Blueprint

class CourseController:
    logger=logging.getLogger("endpoint_logger")

    def __init__(self, course_repository:IRepository):
        self.course_repository=course_repository


    def create_course(self, request:Request) -> Response:
        self.logger.info("Starting create course route.")
        args = CreateCourseParser.parse_args()
        course = None

        try:
            self.course_repository.connect()
            course = self.course_repository.filter_by(name=args.get("name"))
        except SQLAlchemyError as error:
            self.logger.error(f"Internal server error with status 500. Reason: {error}")
            return {"message":"Internal server Error"}, 500
    
        if course is not None:
            self.logger.info("Sending response with status 409. Course exists.")
            return {"message":"Course with the current name already exists."}, 409
    
        error = None
        buffer = io.BytesIO()
        try:
            self.logger.info("Processing the image file.")

            file = args.get("image")
            file.save(buffer)
            buffer.seek(0)
            image = buffer.getvalue()
            mime = magic.Magic(True)
            mime_type = mime.from_buffer(image)

            lang = Languages(args.get("language"))
            newCourse = self.course_repository.create(
                name=args.get("name"), 
                language=lang, 
                description=args.get("description"),
                price=args.get("price"),
                image=image,
                image_mime_type=mime_type,
                users = set([request.user])
            )

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
    

    def get_course(self, request:Request, id:int) -> Response:
        pass

    
    def delete_course(self, request:Request, id:int) -> Response:
        self.logger.info("Starting course delete route.")
        course=None
        try:
            self.course_repository.connect()
            course = self.course_repository.get(id)
        except SQLAlchemyError as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error"}, 500
    
        if course is None:
            self.logger.info("Sending response with status 404. Course don't exists.")
            return {"message":"The current course don't exists."}, 404
        
        try:
            self.course_repository.connect()
            self.course_repository.delete(course)
            self.logger.info("Returning response with status 200. Course deleted succesful.")
            return {"message":"Course deleted succesful."}, 200
        except SQLAlchemyError as error:
            self.logger.error(f"Internal server error with status 500. Reason:\n\n {error}")
            return {"message":"Internal server error"}, 500
        
    
    def custom_course_search(self, request:Request) -> Response:
        self.logger.info("Start course search")   
        args = CourseArgsParser.parse_args()
        filters = []

        add_user_is_not_current_filter(request.user, filters)
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


