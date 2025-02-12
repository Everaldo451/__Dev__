from flask_jwt_extended import get_current_user
from flask import has_app_context, request, Response
import logging

def request_log(response:Response):
    if has_app_context():
        username = "anonymous"
        try:
            current_user = get_current_user()
        except RuntimeError as error:
            current_user = None

        if current_user != None:
            username = current_user.first_name

        extra_info={
            "username": username, 
            "method": request.method,
            "status": response.status_code,
            "path": request.path
        }

        request_logger = logging.getLogger("request_logger")
        request_logger.info(request.path, extra=extra_info)
    
    return response