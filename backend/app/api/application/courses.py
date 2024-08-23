from flask import Blueprint, request, make_response, current_app
from ...models import Course
import base64

courses = Blueprint("courses",__name__,url_prefix="/courses")

@courses.route('/getcourses',methods=["GET"])
def getcourses():

    courses = Course.query.filter(Course.name.ilike(f'%{request.args.get("name")}%'))[:6]


    list = []
    for course in courses:
        image = base64.b64encode(course.image).decode('utf-8')

        list.append({"id":course.id,"name":course.name,"description":course.description,"language":course.language,"image":f'data:image/jpeg;base64, {image}'})

    return {"courses":list}