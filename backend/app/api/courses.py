from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from .forms import CreateCourseForm, GetCourseQuery
from ..db.models import Course, User, db, UserTypes, Languages
from ..db.serializers import CourseSchema
import io
import math
import logging


course_routes = Blueprint("courses",__name__,url_prefix="/courses")

@course_routes.route('/getcourses',methods=["GET"])
@jwt_required(locations="cookies", optional=True)
def getcourses():
    logging.basicConfig(level="DEBUG")
    
    query_form = GetCourseQuery(meta={'csrf':False},formdata=request.args)

    if not query_form.validate():
        print(query_form.data)
        print(query_form.errors)
        return {"message": "Invalid credentials."}, 400
    print(query_form.data)

    name = query_form.name.data

    identity = get_jwt_identity()

    def notUserCourse(): return True
    if identity:
        user = db.session.get(User, identity)
        def notUserCourse(): return not Course.users.any(User.id == user.id)

    """
    def validLanguage(): return True
    lang = None

    for language in Languages: 
        if query_form.lang.data == language.value:
            lang = language
    """
    try:
        lang = Languages(query_form.lang.data)
        def validLanguage(): return Course.language == lang
    except ValueError as error:
        lang = None
        def validLanguage(): return True

    print(lang)
    """
    if lang is None and query_form.lang.data is not None:
        return {"message":"Invalid Language."},400
    """
    
    try:
        def includesName(): return Course.name.ilike(f'%{name}%')

        length = query_form.length.data
        lenDividedBy6 = length/6

        if lenDividedBy6.is_integer():
            limit = 6
        else:
            nextSixMultiple = math.ceil(lenDividedBy6) * 6
            limit = nextSixMultiple - length

        courses = Course.query.filter(
            notUserCourse(), validLanguage(), includesName()
        ).order_by(Course.id.desc()).offset(length).limit(limit).all()

        course_schema = CourseSchema()
        response = course_schema.dump(courses, many=True)

        return {"courses":response}
    except:
        return {"message":"Internal server error."}, 500
    


@course_routes.route('/subscribe/<int:id>',methods=['POST'])
@jwt_required(locations="cookies")
def subscribe(id):
    logging.basicConfig(level="DEBUG")

    try:

        user = db.session.get(User, get_jwt_identity())
    
        if user.user_type == UserTypes.TEACHER:
            return {"message":"Teachers cannot register in course"}, 403
        
        course = db.session.get(Course, id)

        if course is None:
            return {"message": "Invalid course id."}, 404
        
        if course in user.courses:
            return {"message": "User has been already registered."}, 403

        user.courses.add(course)
        db.session.commit()

    except Exception as error: 
        logging.error(error)
        return {"message": "Internal server error."}, 500

    return {"message":"User registered sucessfull."}, 200



@course_routes.route('/unsubscribe/<int:id>',methods=["POST"])
@jwt_required(locations='cookies')
def unsubscribe(id):

    try:
        user = db.session.get(User,get_jwt_identity())

        if user.user_type == UserTypes.TEACHER:
            return {"message":"Teachers cannot unsubscribe in course"}, 403
        
        course = db.session.get(Course, id)

        if not course:
            return {"message": "Invalid course id."}, 404

        if course in user.courses:

            user.courses.remove(course)
            db.session.commit()

            return {"message": "User unsubscribed sucessfull"}, 200

    except KeyError:
        return {"message": "User isn't registered in the course."}, 403


@course_routes.route('/create',methods=["POST"])
@jwt_required(locations='cookies')
def createCourse():
    logging.basicConfig(level="DEBUG")

    try:

        user = db.session.get(User,get_jwt_identity())

        if not user.user_type == UserTypes.TEACHER:
            return {"message":"Students cannot create a course."}, 403

    except:
        return {"message":"Internal server error."}, 500

    form = CreateCourseForm()

    if not form.validate_on_submit():
        logging.error(dict(form.errors))
        return {"message":"Invalid credentials.", "errors": dict(form.errors)}, 400
    
    try:
        course = Course.query.filter_by(name=form.name.data).first()

        if course is not None:
            return {"message":"Course with the current name already exists."}, 400
    except Exception as error:
        logging.error(error)
        return {"message":"Internal server error to found course"}, 500
    

    for language in Languages: 
        if form.language.data == language.value:
            lang = language

    if not lang:
        return {"message":"Invalid language. Isn't possible to create a course with this language."}, 400
    
    buffer = None
    try:
        buffer = io.BytesIO()
        
        f = form.image.data
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

        buffer.close()
        return {"message":"Course created sucessfully."}, 200

    except Exception as e:
        response = {"message": "Ola"}
        status = 500
    except IntegrityError as error:
        response = {"message": "Invalid user"} 
        status = 500

    db.session.rollback()
    if buffer is not None:
        buffer.close()
    
    return response, status



