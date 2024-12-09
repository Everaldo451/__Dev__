from flask import Blueprint, request, make_response, current_app, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..forms import CreateCourseForm
from ...db.models import Course, User, db, UserTypes
import base64
import io

def courses_list(courses) -> list:
    list = []

    for course in courses:
        image = base64.b64encode(course.image).decode('utf-8')

        list.append({"id":course.id,
            "name":course.name,
            "description":course.description,
            "language":course.language,
            "image":f'data:image/jpeg;base64, {image}',
            "students":course.students,
            "teachers": course.teachers
        })

    return list



courses = Blueprint("courses",__name__,url_prefix="/courses")

@courses.route('/getcourses/<name>',methods=["GET"])
def getcourses(name):

    courses = Course.query.filter(Course.name.ilike(f'%{name}%'))[:6]

    return {"courses":courses_list(courses)}


@courses.route('/subscribe/<int:id>',methods=['POST'])
@jwt_required(locations="headers")
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



@courses.route('/unsubscribe/<int:id>',methods=["POST"])
@jwt_required(locations='headers')
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


@courses.route('/create',methods=["POST"])
@jwt_required(locations='headers')
def createCourse():
    print("oi")

    form = CreateCourseForm()
    response = make_response(redirect(request.origin))

    if not form.validate_on_submit():
        print("invalido")
        print(request.form, request.files['image'])
        response.status_code = 400
        return response
    
    buffer = None
    try:
        
        user = db.session.query(User).get(get_jwt_identity())

        if not user.user_type == UserTypes.TEACHER:
            response.status_code = 401
            return response
        
        f = form.image.data

        buffer = io.BytesIO()

        f.save(buffer)

        buffer.seek(0)

        image = buffer.getvalue()
        
        newCourse = Course(
            name = form.name.data,
            language = form.language.data,
            description = form.description.data,
            image = image,
        )

        user = db.session.merge(user)
            
        db.session.add(newCourse)
        newCourse.users.add(user)
        db.session.commit()
        
        buffer.close()

        return response


    except Exception as e:
        db.session.rollback()
        if buffer is not None:
            buffer.close()
        print(e) 
        response.status_code = 400
        return response



