from datetime import timedelta
import os
import copy

LOGGERS={
    "version":1,
    "disable_existing_loggers": False,
    "formatters": {
        "request_formatter": {
            "format": '[%(asctime)s] %(method)s %(path)s %(status)s, %(username)s',
            "datefmt": '%d-%m-%Y %H:%M:%S'
        },
        "endpoint_formatter": {
            "format": '[%(asctime)s] - (%(levelname)s) %(message)s',
            "datefmt": '%d-%m-%Y %H:%M:%S'
        }
    },
    "handlers": {
        "request_handler": {
            "class": 'logging.FileHandler',
            "formatter": 'request_formatter',
            "level": 'DEBUG',
            "filename": ""
        },
        "endpoint_handler": {
            "class": 'logging.StreamHandler',
            "formatter": 'endpoint_formatter',
            "level": 'DEBUG',
            "stream": 'ext://sys.stdout',
        }
    },
    "loggers": {
        "request_logger": {
            "level": "DEBUG",
            "handlers": ["request_handler"]
        },
        "endpoint_logger": {
            "level": "DEBUG",
            "handlers": ["endpoint_handler"]
        }
    },
}

main_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Config(object):

    SECRET_KEY = os.getenv("SECRET_KEY")
    SESSION_COOKIE_HTTPONLY = True

    JWT_SECRET_KEY = SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=1)
    JWT_TOKEN_LOCATION = ["headers","cookies"]
    JWT_SESSION_COOKIE = False
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_CSRF_IN_COOKIES = False
    JWT_ACCESS_COOKIE_NAME = "access_token"
    JWT_REFRESH_COOKIE_NAME = "refresh_token"

    REDIS_DOMAIN = os.getenv("REDIS_DOMAIN")
    REDIS_PORT = os.getenv("REDIS_PORT")

class ProductionConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", f"sqlite:///{main_dir}/production.db")
    
    LOGGER = {
        "handlers": [],
        "formatters": [],
        "loggers": []
    }
    @property
    def LOGGER(self):
        log_dir="logs"
        full_log_dir=os.path.join(main_dir, log_dir)
        print(main_dir)
        if not os.path.exists(full_log_dir):
            os.mkdir(full_log_dir)

        handlers:dict=LOGGERS.get("handlers")
        loggers:dict=LOGGERS.get("loggers")

        endpoint_handler:dict=handlers.get("endpoint_handler")
        endpoint_logger:dict=loggers.get("endpoint_logger")

        endpoint_handler.update({"level":"ERROR"})
        endpoint_logger.update({"level":"ERROR"})

        request_handler:dict=handlers.get("request_handler")
        request_handler.update({"filename":os.path.join(full_log_dir, "requests.log")})

        print(LOGGERS)

        return LOGGERS


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", f"sqlite:///{main_dir}/dev.db")
    
    LOGGER = {
        "handlers": [],
        "formatters": [],
        "loggers": []
    }
    @property
    def LOGGER(self):
        handlers:dict=LOGGERS.get("handlers")
        formatters:dict=LOGGERS.get("formatters")
        loggers:dict=LOGGERS.get("loggers")

        endpoint_handler:dict=handlers.get("endpoint_handler")
        endpoint_logger:dict=loggers.get("endpoint_logger")

        endpoint_handler.update({"level":"INFO"})
        endpoint_logger.update({"level":"INFO"})

        handlers.pop("request_handler")
        formatters.pop("request_formatter")
        loggers.pop("request_logger")

        return LOGGERS
    

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    
    LOGGER = {
        "handlers": [],
        "formatters": [],
        "loggers": []
    }
    @property
    def LOGGER(self):
        LOGGERS_COPY=copy.deepcopy(LOGGERS)
        handlers:dict=LOGGERS_COPY.get("handlers")
        formatters:dict=LOGGERS_COPY.get("formatters")
        loggers:dict=LOGGERS_COPY.get("loggers")

        endpoint_handler:dict=handlers.get("endpoint_handler")
        endpoint_logger:dict=loggers.get("endpoint_logger")

        endpoint_handler.update({"level":"DEBUG"})
        endpoint_logger.update({"level":"DEBUG"})

        handlers.pop("request_handler")
        formatters.pop("request_formatter")
        loggers.pop("request_logger")

        return LOGGERS_COPY