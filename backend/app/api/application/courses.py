from flask import Blueprint, request, make_response, current_app, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...models import Course, User
import base64

courses = Blueprint("courses",__name__,url_prefix="/courses")

@courses.route('/getcourses/<name>',methods=["GET"])
def getcourses(name):

    courses = Course.query.filter(Course.name.ilike(f'%{name}%'))[:6]


    list = []
    for course in courses:
        image = base64.b64encode(course.image).decode('utf-8')

        list.append({"id":course.id,
                     "name":course.name,
                     "description":course.description,
                     "language":course.language,
                     "image":f'data:image/jpeg;base64, {image}',
                     "users":course.users
                     })

    return {"courses":list}



@courses.route('/subscribe/<int:id>',methods=['POST'])
@jwt_required(locations="headers")
def subscribe(id):

    response = redirect("http://localhost:5173")

    try:

        user = User.query.get(get_jwt_identity())

        print(user)

        course = Course.query.get(id)

        

        with current_app.app_context():
            print("oi")
            user.courses.append(course)
            print(current_app)
            current_app.db.session.commit()

        print(user.courses)

    except Exception as e: print(e); pass

    return response
