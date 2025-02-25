from flask_restx import reqparse
from .custom_types.no_html_str import no_html_str

UserConfigurationParser = reqparse.RequestParser()
UserConfigurationParser.add_argument(
    "full_name", 
    type=no_html_str,
    required=False
)

UserConfigurationParser.add_argument(
    "email", 
    type=no_html_str,
    required=False
)
