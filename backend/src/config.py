from datetime import timedelta
import logging
import os
from dotenv import load_dotenv

main_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Config(object):
    load_dotenv()

    SECRET_KEY = os.getenv("SECRET_KEY")
    SESSION_COOKIE_HTTPONLY = True

    JWT_SECRET_KEY = SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=1)
    JWT_TOKEN_LOCATION = ["headers","cookies"]
    JWT_SESSION_COOKIE = False
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_ACCESS_COOKIE_NAME = "access_token"
    JWT_REFRESH_COOKIE_NAME = "refresh_token"

class ProductionConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", f"sqlite:///{main_dir}/production.db")
    LOGGER = {
        "version":1,
        "disable_existing_loggers": False,
        "formatters": {
            "request_formatter": {
                "format": '[%(asctime)s] %(method)s %(path)s %(status)s, %(username)s',
                "datefmt": '%d-%m-%Y %H:%M:%S'
            }
        },
        "handlers": {
            "request_handler": {
                "class": 'logging.FileHandler',
                "formatter": 'request_formatter',
                "level": 'INFO',
                "filename": "logs/requests.log"
            }
        },
        "loggers": {
            "request_logger": {
                "level": "DEBUG",
                "handlers": ["request_handler"]
            }
        }
    }

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", f"sqlite:///{main_dir}/dev.db")
    LOGGER = {
        "version":1,
        "disable_existing_loggers": False,
        "formatters": {
            "endpoint_formatter": {
                "format": '%(asctime)s - (%(levelname)s) %(message)s',
                "datefmt": '[%d-%m-%Y] %H:%M:%S'
            }
        },
        "handlers": {
            "endpoint_handler": {
                "class": 'logging.StreamHandler',
                "formatter": 'endpoint_formatter',
                "level": 'INFO',
                'stream': 'ext://sys.stdout',
            }
        },
        "loggers": {
            "endpoint_logger": {
                "handlers": ["endpoint_handler"]
            }
        }
    }

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    LOGGER = {
        "version":1,
        "disable_existing_loggers": False,
        "formatters": {
            "endpoint_formatter": {
                "format": '%(asctime)s - (%(levelname)s) %(message)s',
                "datefmt": '[%d-%m-%Y] %H:%M:%S'
            }
        },
        "handlers": {
            "endpoint_handler": {
                "class": 'logging.StreamHandler',
                "formatter": 'endpoint_formatter',
                "level": 'WARNING',
                'stream': 'ext://sys.stdout',
            }
        },
        "loggers": {
            "endpoint_logger": {
                "handlers": ["endpoint_handler"]
            }
        }
    }