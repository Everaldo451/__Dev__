from flask_restx import reqparse
from .custom_types.escaped_html_str import escaped_html_str

UserConfigurationParser = reqparse.RequestParser()
UserConfigurationParser.add_argument(
    name="email", 
    required=False,
    type=escaped_html_str, 
    help="Invalid email."
)
UserConfigurationParser.add_argument(
    name="full_name",
    required=False,
    type=escaped_html_str,
    help="You need to insert a full name."
)
