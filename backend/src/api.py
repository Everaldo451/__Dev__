from flask_restx import Api, fields
from .serializers.course_serializer import CourseSerializer
from .serializers.user_serializer import UserSerializer

authorizations = {
    "accessJWT": {
        "type": "apiKey",
        "in": "cookie",
        "name": "access_token",
    },
    "refreshJWT": {
        "type": "apiKey",
        "in": "cookie",
        "name": "refresh_token",
    }
}

api = Api(
    title="API",
    version="1.0",
    description="The __DEV__ application api.", 
    doc="/doc/",  
    authorizations=authorizations, 
    security=["accessJWT", "refreshJWT"]
)


course_serializer = api.model("Course", CourseSerializer)
course_reponse = api.model("Course Response", {
    "message": fields.String,
    "course": fields.Nested(course_serializer, allow_null=True)
})
courses_response = api.model("Courses Response", {
    "message": fields.String,
    "courses": fields.List(fields.Nested(course_serializer))
})

user_serializer = api.model("User", UserSerializer)