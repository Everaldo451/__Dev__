from ..models.course_model import Course
import math

def filter_courses(filters:list, offset:int):
    limit = math.ceil(offset/6)*6 - offset if offset > 0 else 6
  
    courses = Course.query.filter(*filters
        ).order_by(Course.date_created.desc()).offset(offset).limit(limit).all()
    return {
        "message":"Courses sending succesful.",
        "courses":courses
    }, 200
    