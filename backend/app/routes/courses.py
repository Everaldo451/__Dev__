from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
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
    identity = get_jwt_identity()

    if not query_form.validate():
        return {"message": "Invalid credentials."}, 400
    
    def includes_name(): return Course.name.ilike(f'%{name}%')

    def not_user_course(): return True
    if identity:
        user = db.session.get(User, identity)
        if user is not None:
            def not_user_course(): return ~Course.users.any(User.id == user.id)

    try:
        lang = Languages(query_form.lang.data)
        def valid_language(): return Course.language == lang
    except ValueError as error:
        lang = None
        def valid_language(): return True

    length = query_form.length.data
    len_divided_by_six = length/6

    if len_divided_by_six.is_integer():
        limit = 6
    else:
        next_six_multiple = math.ceil(len_divided_by_six) * 6
        limit = next_six_multiple - length

    try:
        courses = Course.query.filter(
            not_user_course(), valid_language(), includes_name()
        ).order_by(Course.id.desc()).offset(length).limit(limit).all()

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
        user = db.session.get(User, get_jwt_identity())
        course = db.session.get(Course, id)
    except Exception as error:
        return {"message":"Internal server Error"}, 500
    
    if user is None:
        return {"message":"Invalid user."}, 401
    if user.user_type == UserTypes.TEACHER:
        return {"message":"Teachers cannot register in course"}, 403
    
    if course is None:
        return {"message": "Invalid course id."}, 404   
    if course in user.courses:
        return {"message": "User has been already registered in this course."}, 403
    
    try:
        user.courses.add(course)
        db.session.commit()
        return {"message":"User registered sucessfull."}, 200
    except Exception as error: 
        logging.error(error)
        return {"message": "Internal server error."}, 500


@course_routes.route('/unsubscribe/<int:id>',methods=["POST"])
@jwt_required(locations='cookies')
def unsubscribe(id):

    try:
        user = db.session.get(User,get_jwt_identity())
        course = db.session.get(Course, id)
    except Exception as error:
        return {"message":"Internal server Error"}, 500
    
    if user is None:
        return {"message":"Invalid user."}, 401
    if user.user_type == UserTypes.TEACHER:
        return {"message":"Teachers cannot unsubscribe in course"}, 403

    if course is None:
        return {"message": "Invalid course id."}, 404
    if not course in user.courses:
        return {"message": "User isn't registered in the course."}, 403
    
    try:
        user.courses.remove(course)
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
        user = db.session.get(User,get_jwt_identity())
        course = Course.query.filter_by(name=form.name.data).first()
    except Exception as error:
        return {"message":"Internal server Error"}, 500
    
    if user is None:
        return {"message":"Invalid user."}, 401
    if user.user_type == UserTypes.STUDENT:
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

        newCourse = Course(
            name = form.name.data,
            language = lang,
            description = form.description.data,
            image = image,
        )

        db.session.add(newCourse)
        newCourse.users.add(user)
        db.session.commit()

        response = {"message":"Course created sucessfully."}
        status = 200
    except Exception as error:
        response = {"message": "Ola"}
        status = 500
    except IntegrityError as error:
        response = {"message": "Invalid user"} 
        status = 500

    if error is not None:
        db.session.rollback()
    buffer.close()
    return response, status



