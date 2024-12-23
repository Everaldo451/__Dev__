from flask import Blueprint, request, make_response, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from .forms import CreateCourseForm
from ..db.models import Course, User, db, UserTypes, Languages
from ..db.serializers import CourseSchema
import io


course_routes = Blueprint("courses",__name__,url_prefix="/courses")

@course_routes.route('/getcourses/<name>',methods=["GET"])
def getcourses(name):

    courses = Course.query.filter(Course.name.ilike(f'%{name}%'))[:6]

    course_schema = CourseSchema()

    response = course_schema.dump(courses, many=True)

    return {"courses":response}


@course_routes.route('/subscribe/<int:id>',methods=['POST'])
@jwt_required(locations="cookies")
def subscribe(id):

    response = make_response(redirect(request.origin))

    try:

        user = User.query.get(get_jwt_identity())

        if user.user_type == UserTypes.TEACHER:
            return response
        
        course = Course.query.get(id)

        if not course in user.courses:

            user.courses.add(course)
            db.session.flush()
            db.session.commit()

    except: pass

    return response



@course_routes.route('/unsubscribe/<int:id>',methods=["POST"])
@jwt_required(locations='cookies')
def unsubscribe(id):

    response = make_response(redirect(request.origin))

    try:
        user = User.query.get(get_jwt_identity())

        if user.user_type == UserTypes.TEACHER:
            return response
        
        course = Course.query.get(id)

        if course in user.courses:

            user.courses.remove(course)
            db.session.flush()
            db.session.commit()

    except: pass

    return response


@course_routes.route('/create',methods=["POST"])
@jwt_required(locations='cookies')
def createCourse():
    print("oi")

    form = CreateCourseForm()

    if not form.validate_on_submit():
        return {"message":"Invalid credentials"}, 400
    
    for language in Languages: 
        if form.language.data == language.value:
            lang = language

    if not lang:
        return {"message":"Invalid language. Isn't possible to create a course with this language."}, 400
    
    buffer = None
    try:
        
        user = User.query.get(get_jwt_identity())

        if not user.user_type == UserTypes.TEACHER:
            return {"message":"User isn't a teacher."}, 401
        
        f = form.image.data

        buffer = io.BytesIO()

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
        response_with_exception = make_response({"message": ""})
        response_with_exception.status_code=500
    except IntegrityError as error:
        response_with_exception = make_response({"message": "invalid user"})
        response_with_exception.status_code=500

    db.session.rollback()
    if buffer is not None:
        buffer.close()
    print(e) 
    return response_with_exception



