import logging.config
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
from .services.jwt_service import jwt
from .initializers.routers import initialize_api_routers
from .middlewares.after.request_log import request_log
import logging
from .api import api
from .db import db
import os

migrate = Migrate()

def create_app():
    load_dotenv()
    app = Flask(__name__)
    cors = CORS(
        origins=f"http://{os.getenv("FRONT_DOMAIN")}:{os.getenv("FRONT_PORT")}", 
        supports_credentials=True
    )

    from . import config
    flask_env = os.getenv("FLASK_ENV")
    if flask_env == "production":
        print("production Env")
        app.config.from_object(config.ProductionConfig())
    elif flask_env == "test":
        print("test Env")
        app.config.from_object(config.TestingConfig())
    else:
        print("development Env")
        app.config.from_object(config.DevelopmentConfig())

    logging.config.dictConfig(app.config.get("LOGGER"))

    db.init_app(app)
    api.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    jwt.init_app(app)

    initialize_api_routers(api)

    app.after_request(request_log)

    return app