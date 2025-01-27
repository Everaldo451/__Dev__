from flask import make_response
from flask_jwt_extended import create_access_token, set_access_cookies
from flask_jwt_extended import create_refresh_token, set_refresh_cookies

def create_response_all_tokens(identity:str, message:str, status:int):
    refresh_token = create_refresh_token(identity=identity)
    access_token = create_access_token(identity=identity)

    response = make_response({"message": message}, status)

    set_refresh_cookies(response,refresh_token)
    set_access_cookies(response,access_token)
    return response