from flask_restx import reqparse
from .custom_types.no_html_str import no_html_str

authentication_parser = reqparse.RequestParser()
authentication_parser.add_argument(
    name="email", 
    required=True,
    type=no_html_str, 
    help="Invalid email."
)
authentication_parser.add_argument(
    name="password", 
    required=True,
    type=no_html_str, 
    help="Invalid password"
)
authentication_parser.add_argument(
    name="full_name",
    required=True,
    type=no_html_str,
    help="You need to insert a full name."
)

sigin_in_parser = authentication_parser.copy()
sigin_in_parser.remove_argument("full_name")

RegisterParser = authentication_parser.copy()
RegisterParser.add_argument(
    name="is_teacher",
    required=False,
    type=no_html_str,
)