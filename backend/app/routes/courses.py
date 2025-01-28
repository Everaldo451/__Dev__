from flask import Blueprint, request
from flask_jwt_extended import jwt_required, current_user
from sqlalchemy.exc import IntegrityError
from ..forms.courses import CourseQueryStringFilters, CreateCourseForm
from ..models.course_model import Course, Languages
from ..models.user_model import User, UserTypes
from ..serializers.course_serializer import CourseSchema
from ..utils.courses.filter_courses import filter_courses
from ..decorators.verify_permission import verify_user_permissions
from ..decorators.validate_data import validate_data_on_submit, validate_data
from ..db import db
import logging
import magic
import io

#Course Blueprint
courses = Blueprint("courses",__name__,url_prefix="/courses")

@courses.route('/search',methods=["GET"])
@validate_data(
    CourseQueryStringFilters, 
    formdata=lambda: request.args, 
    meta={'csrf':False}
)
@jwt_required(locations="cookies", optional=True)
def search():
    logging.basicConfig(level="DEBUG")
    query_string = CourseQueryStringFilters(meta={'csrf':False},formdata=request.args)
    filters = []

    name = query_string.name.data
    filters.append(Course.name.ilike(f'%{name}%'))
    if current_user != None:
        filters.append(~Course.users.any(User.id == current_user.id))

    try:
        filters.append(Course.language == Languages(query_string.lang.data))
    except ValueError as error: pass

    length = query_string.length.data
    try:
        return filter_courses(filters, length)
    except Exception as error:
        print(error)
        return {"message":"Internal server error."}, 500


@courses.route("/<int:id>", methods=["GET"])
def get_course(id):pass

@courses.route('/<int:id>', methods=["DELETE"])
@verify_user_permissions([UserTypes.TEACHER, UserTypes.ADMIN])
@jwt_required(locations='cookies')
def delete_course(id):
    course=None
    try:
        course = db.session.get(Course,id)
    except Exception as error:
        return {"message":"Internal server error"}, 500
    
    if course is None:
        return {"message":"The current course don't exists."}, 404
    course.delete()

    return {"message":"Course deleted succesful."}, 200


@courses.route('',methods=["POST"])
@validate_data_on_submit(CreateCourseForm)
@verify_user_permissions(
    [UserTypes.ADMIN, UserTypes.TEACHER], 
    "Students cannot create a course."
)
@jwt_required(locations='cookies')
def post_course():
    logging.basicConfig(level="DEBUG")
    form = CreateCourseForm()
    course = None
    try:
        course = Course.query.filter_by(name=form.name.data).first()
    except Exception as error:
        return {"message":"Internal server Error"}, 500
    
    if course is not None:
        return {"message":"Course with the current name already exists."}, 400
    
    error = None
    buffer = io.BytesIO()
    
    try:
        f = form.image.data
        f.save(buffer)
        buffer.seek(0)
        image = buffer.getvalue()
        mime = magic.Magic(True)
        mime_type = mime.from_buffer(image)

        lang = Languages(form.language.data)
        newCourse = Course(
            name=form.name.data, 
            language=lang, 
            description=form.description.data, 
            image=image,
            image_mime_type=mime_type
        )
        newCourse.users.add(current_user)
        newCourse.create()

        return {
            "message":"Course created sucessfully.",
            "course":CourseSchema().dump(newCourse)
        }
    except Exception as error:
        response, status = {"message": "Ola"}, 500
    except IntegrityError as error:
        response, status = {"message": "Invalid user"}, 500 

    if error is not None:
        db.session.rollback()

    buffer.close()
    return response, status



