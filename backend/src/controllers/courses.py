from flask import request
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user
from sqlalchemy.exc import IntegrityError
from ..models.course_model import Course, Languages
from ..models.user_model import User, UserTypes
from ..utils.filter_courses import filter_courses
from ..decorators.verify_permission import verify_user_permissions
from ..parsers.courses import CreateCourseParser, CourseArgsParser
from ..serializers.course_serializer import CourseSerializer, OneCourseResponseSerializer, ManyCourseResponseSerializer
from ..db import db
import logging
import magic
import io

#Course Blueprint
api = Namespace("courses", path="/courses")
model = api.model("Course", CourseSerializer)

@api.route("")
class CourseList(Resource):

    @jwt_required(locations='cookies')
    @verify_user_permissions(
        [UserTypes.ADMIN, UserTypes.TEACHER], 
        "Students cannot create a course."
    )
    @api.marshal_with(OneCourseResponseSerializer)
    def post(self):
        logging.basicConfig(level="DEBUG")
        args = CreateCourseParser.parse_args()
        print(args)
        course = None
        try:
            course = Course.query.filter_by(name=args.get("name")).first()
        except Exception as error:
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

            return {
                "message":"Course created sucessfully.",
                "course":newCourse
            }
        except Exception as error:
            response, status = {"message": "Ola"}, 500
        except IntegrityError as error:
            response, status = {"message": "Invalid user"}, 500 

        if error is not None:
            db.session.rollback()

        buffer.close()
        return response, status


@api.route("/<int:id>")
class Courses(Resource):
    
    def get(self, id):pass

    @verify_user_permissions([UserTypes.TEACHER, UserTypes.ADMIN])
    @jwt_required(locations='cookies')
    def delete_(self, id):
        course=None
        try:
            course = db.session.get(Course,id)
        except Exception as error:
            return {"message":"Internal server error"}, 500
    
        if course is None:
            return {"message":"The current course don't exists."}, 404
        course.delete()

        return {"message":"Course deleted succesful."}, 200


@api.route("/search")
class Search(Resource):
    
    @jwt_required(locations="cookies", optional=True)
    @api.marshal_with(ManyCourseResponseSerializer)
    def get(self):
        logging.basicConfig(level="DEBUG")    
        args = CourseArgsParser.parse_args()
        filters = []

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
            
        if current_user != None:
            filters.append(~Course.users.any(User.id == current_user.id))

        try:
            filters.append(Course.language == Languages(args.get("language")))
        except ValueError as error: pass

        length = args.get("length")
        try:
            return filter_courses(filters, length)
        except Exception as error:
            print(error)
            return {"message":"Internal server error."}, 500


