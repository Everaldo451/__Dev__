from datetime import timedelta
import os
import secrets
from dotenv import load_dotenv

class Config(object):
    load_dotenv()

    SECRET_KEY = secrets.token_hex(16)
    SESSION_COOKIE_HTTPONLY = True

    JWT_SECRET_KEY = SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRE = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRE = timedelta(days=1)
    JWT_TOKEN_LOCATION = ["headers","cookies"]
    JWT_SESSION_COOKIE = False
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_ACCESS_COOKIE_NAME = "access_token"
    JWT_REFRESH_COOKIE_NAME = "refresh_token"

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", "sqlite:///dev.db")

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"