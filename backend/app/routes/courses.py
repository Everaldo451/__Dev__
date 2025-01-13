from flask import Blueprint, request
from flask_jwt_extended import jwt_required, current_user
from sqlalchemy.exc import IntegrityError
import io
import math
import logging
from ..db import db
from ..forms.courses import GetCourseQuery, CreateCourseForm
from ..models.course_model import Course, Languages
from ..models.user_model import User, UserTypes
from ..serializers.course_serializer import CourseSchema

#Course Blueprint
course_routes = Blueprint("courses",__name__,url_prefix="/courses")

@course_routes.route('/getcourses',methods=["GET"])
@jwt_required(locations="cookies", optional=True)
def getcourses():
    logging.basicConfig(level="DEBUG")
    query_form = GetCourseQuery(meta={'csrf':False},formdata=request.args)
    name = query_form.name.data
    filters = []

    if not query_form.validate():
        return {"message": "Invalid credentials."}, 400
    
    filters.append(Course.name.ilike(f'%{name}%'))
    if current_user != None:
        filters.append(~Course.users.any(User.id == current_user.id))

    try:
        filters.append(Course.language == Languages(query_form.lang.data))
    except ValueError as error: pass

    length = query_form.length.data
    limit = math.ceil(length/6)*6 - length if length > 0 else 6
    try:
        courses = Course.query.filter(*filters).order_by(Course.id.desc()).offset(length).limit(limit).all()
        course_schema = CourseSchema()
        response = course_schema.dump(courses, many=True)
        return {"courses":response}
    except Exception as error:
        print(error)
        return {"message":"Internal server error."}, 500


@course_routes.route('/subscribe/<int:id>',methods=['POST'])
@jwt_required(locations="cookies")
def subscribe(id):
    logging.basicConfig(level="DEBUG")

    try:   
        course = db.session.get(Course, id)
    except Exception as error:
        return {"message":"Internal server Error"}, 500
    
    if current_user.user_type == UserTypes.TEACHER:
        return {"message":"Teachers cannot register in course"}, 403
    
    if course is None:
        return {"message": "Invalid course id."}, 404   
    if course in current_user.courses:
        return {"message": "User has been already registered in this course."}, 403
    
    try:
        current_user.courses.add(course)
        db.session.commit()
        return {"message":"User registered sucessfull."}, 200
    except Exception as error: 
        logging.error(error)
        return {"message": "Internal server error."}, 500


@course_routes.route('/unsubscribe/<int:id>',methods=["POST"])
@jwt_required(locations='cookies')
def unsubscribe(id):

    try:
        course = db.session.get(Course, id)
    except Exception as error:
        return {"message":"Internal server Error"}, 500
    
    if current_user.user_type == UserTypes.TEACHER:
        return {"message":"Teachers cannot unsubscribe in course"}, 403

    if course is None:
        return {"message": "Invalid course id."}, 404
    if not course in current_user.courses:
        return {"message": "User isn't registered in the course."}, 403
    
    try:
        current_user.courses.remove(course)
        db.session.commit()
        return {"message": "User unsubscribed sucessfull"}, 200
    except Exception as error:
        return {"message": "User isn't registered in the course."}, 403


@course_routes.route('/create',methods=["POST"])
@jwt_required(locations='cookies')
def createCourse():
    logging.basicConfig(level="DEBUG")

    form = CreateCourseForm()
    if not form.validate_on_submit():
        logging.error(dict(form.errors))
        return {"message":"Invalid credentials.", "errors": dict(form.errors)}, 400
    
    try:
        course = Course.query.filter_by(name=form.name.data).first()
    except Exception as error:
        return {"message":"Internal server Error"}, 500
    
    if current_user.user_type == UserTypes.STUDENT:
        return {"message":"Students cannot create a course."}, 403
    
    if course is not None:
        return {"message":"Course with the current name already exists."}, 400
    
    lang = Languages(form.language.data)
    error = None
    buffer = io.BytesIO()
    f = form.image.data
    
    try:
        f.save(buffer)
        buffer.seek(0)
        image = buffer.getvalue()

        newCourse = Course(name=form.name.data, language=lang, description=form.description.data, image=image)

        db.session.add(newCourse)
        newCourse.users.add(current_user)
        db.session.commit()

        response, status = {"message":"Course created sucessfully."}, 200
    except Exception as error:
        response, status = {"message": "Ola"}, 500
    except IntegrityError as error:
        response, status = {"message": "Invalid user"}, 500 

    if error is not None:
        db.session.rollback()
    buffer.close()
    return response, status



