from flask_jwt_extended.config import config
from ..types.request import Request
from ..types.response import Response

class CSRFTokenController:
    def get_cookie_names(self, request:Request) -> Response:
        return {
            "access_csrf_cookie_name": config.access_csrf_cookie_name,
            "refresh_csrf_cookie_name": config.refresh_csrf_cookie_name
        }