from ..models.course_model import Course

def filter_courses(filters:list, offset:int):
    limit = 6 - (offset % 6)
  
    courses = Course.query.filter(*filters
        ).order_by(Course.date_created.desc()).offset(offset).limit(limit).all()
    return {
        "message":"Courses sending succesful.",
        "courses":courses
    }, 200
    