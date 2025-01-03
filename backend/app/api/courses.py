from flask import Blueprint, request, make_response, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from .forms import CreateCourseForm
from ..db.models import Course, User, db, UserTypes, Languages
from ..db.serializers import CourseSchema
import io
import logging


course_routes = Blueprint("courses",__name__,url_prefix="/courses")

@course_routes.route('/getcourses/<name>',methods=["GET"])
def getcourses(name):

    courses = Course.query.filter(Course.name.ilike(f'%{name}%')).order_by(Course.id.desc())[:6]

    course_schema = CourseSchema()

    response = course_schema.dump(courses, many=True)

    return {"courses":response}


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



