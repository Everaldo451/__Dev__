from flask import request as flask_request
from flask_restx import Namespace, Resource
from flask_jwt_extended import current_user

from ..controllers.csrf import CSRFTokenController
from ..adapters.request_adapter import RequestAdapter

csrf_controller = CSRFTokenController()

api = Namespace("csrf", path="/csrf")

@api.route("")
class CSRFCookieNames(Resource):
    def get(self):
        request = RequestAdapter.adapt_request(flask_request, current_user)
        return csrf_controller.get_cookie_names(request)