from sqlalchemy.orm import joinedload
from flask import Blueprint, request, make_response, current_app, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity, current_user
from ...models import Course, User, db
import base64

def courses_list(courses) -> list:
    list = []

    for course in courses:
        image = base64.b64encode(course.image).decode('utf-8')

        list.append({"id":course.id,
                     "name":course.name,
                     "description":course.description,
                     "language":course.language,
                     "image":f'data:image/jpeg;base64, {image}',
                     "students":len(course.students),
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

        if user.user_type.value == "teacher":
            return response
        
        course = Course.query.get(id)

        if not course in user.courses:

            user.courses.append(course)
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

        if user.user_type.value == "teacher":
            return response
        
        course = Course.query.get(id)

        if course in user.courses:

            user.courses.remove(course)
            db.session.flush()
            db.session.commit()

    except: pass

    return response

