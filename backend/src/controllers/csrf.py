from flask_restx import Namespace, Resource
from flask_jwt_extended.config import config

api = Namespace("csrf", path="/csrf")

@api.route("")
class CSRFCookieNames(Resource):
    def get(self):
        return {
            "access_csrf_cookie_name": config.access_csrf_cookie_name,
            "refresh_csrf_cookie_name": config.refresh_csrf_cookie_name
        }