from flask_restx import reqparse
from .custom_types.escaped_html_str import escaped_html_str

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

RegisterParser = authentication_parser.copy()
RegisterParser.add_argument(
    name="is_teacher",
    required=False,
    type=escaped_html_str,
)
RegisterParser.replace_argument(
    name="email", 
    required=True,
    type=escaped_html_str, 
    help="Invalid email."
)
RegisterParser.replace_argument(
    name="password", 
    required=True,
    type=escaped_html_str, 
    help="Invalid password"
)
RegisterParser.replace_argument(
    name="full_name",
    required=True,
    type=escaped_html_str,
    help="You need to insert a full name."
)