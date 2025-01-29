from flask_restx import reqparse
from werkzeug.datastructures import FileStorage
from ..enums import Languages

CreateCourseParser = reqparse.RequestParser()
CreateCourseParser.add_argument(
    "name",
    type=str,
    required=True,
    help=""
)
CreateCourseParser.add_argument(
    "language",
    type=str,
    required=True,
    choices=[language.value for language in Languages]
)
CreateCourseParser.add_argument(
    "description",
    type=str,
    required=True,
)
CreateCourseParser.add_argument(
    "image",
    location="files",
    type=FileStorage,
    required=True
)


CourseArgsBaseParser = reqparse.RequestParser()
CourseArgsBaseParser.add_argument(
    "lang",
    type=str,
    choices=[language.value for language in Languages],
    required=False
)
CourseArgsBaseParser.add_argument(
    "length",
    type=int,
    required=True
) 

CourseArgsParser = CourseArgsBaseParser.copy()
CourseArgsParser.add_argument(
    "name",
    type=str,
    required=False
)
