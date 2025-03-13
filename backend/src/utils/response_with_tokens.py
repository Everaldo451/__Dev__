from flask import make_response
from flask_jwt_extended.config import config
from flask_jwt_extended import create_access_token, set_access_cookies
from flask_jwt_extended import create_refresh_token, set_refresh_cookies
from flask_jwt_extended import get_csrf_token
from logging import Logger

def generate_csrf_tokens(access_token: str, refresh_token:str):
    access_csrf_token = get_csrf_token(access_token)
    print(access_csrf_token)
    return [access_csrf_token, get_csrf_token(refresh_token)]

def add_csrf_tokens_to_response_data(
    response_data: dict, 
    access_csrf_token:str, 
    refresh_csrf_token:str
):
    response_data["csrf_token_cookies"] = {
        f"{config.access_csrf_cookie_name}": {
            "value":access_csrf_token,
            "lifetime":config.access_expires.total_seconds()
        },
        f"{config.refresh_csrf_cookie_name}": {
            "value":refresh_csrf_token,
            "lifetime":config.refresh_expires.total_seconds()
        }
    }

    return response_data

def create_response_all_tokens(identity:str, message:str, status:int, logger:Logger):
    logger.info("Generating the tokens")
    refresh_token = create_refresh_token(identity=identity)
    access_token = create_access_token(identity=identity)

    logger.info("Generating the csrf tokens")
    access_csrf_token = get_csrf_token(access_token)
    refresh_csrf_token= get_csrf_token(refresh_token)

    logger.info("Creating the response data.")
    response_data = {
        "message": message,
    }
    logger.info("Actualizing the response data with the csrf tokens.")
    response = make_response(
        add_csrf_tokens_to_response_data(response_data, access_csrf_token, refresh_csrf_token), 
        status
    )

    logger.info("Adding token cookies to response.")
    set_refresh_cookies(response,refresh_token)
    set_access_cookies(response,access_token)
    return response