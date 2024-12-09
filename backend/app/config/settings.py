from datetime import timedelta
import os
import secrets
from dotenv import load_dotenv

class Config(object):
    load_dotenv()

    SECRET_KEY = secrets.token_hex(16)
    SESSION_COOKIE_HTTPONLY = True

    JWT_SECRET_KEY = SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRE = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRE = timedelta(days=1)
    JWT_TOKEN_LOCATION = ["headers","cookies"]
    JWT_SESSION_COOKIE = False
    JWT_ACCESS_COOKIE_NAME = "access_token"
    JWT_REFRESH_COOKIE_NAME = "refresh_token"
    JWT_REFRESH_CSRF_HEADER_NAME = "X-CSRF-REFRESH"
    JWT_ACCESS_CSRF_HEADER_NAME = "X-CSRF-ACCESS"

class GeneralConfig(Config):

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")

class TestingConfig(Config):

    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"