from flask_restx import Namespace, Resource, fields, reqparse

authentication_parser = reqparse.RequestParser()
authentication_parser.add_argument(
    name="email", 
    required=True,
    type=str, 
    help="Invalid email."
)
authentication_parser.add_argument(
    name="password", 
    required=True,
    type=str, 
    help="Invalid password"
)
authentication_parser.add_argument(
    name="full_name",
    required=True,
    type=str,
    help="You need to insert a full name."
)

sigin_in_parser = authentication_parser.copy()
sigin_in_parser.remove_argument("full_name")

register_parser = authentication_parser.copy()

teacher_register_parser = authentication_parser.copy()
teacher_register_parser.add_argument(
    name="is_teacher",
    required=True,
    type=str,
)
