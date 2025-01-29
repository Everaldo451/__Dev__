from flask import Flask, request
from flask_migrate import Migrate
from flask_restx import Api
from dotenv import load_dotenv
from .routes.csrf import csrf
from .namespaces.courses import api as courses
from .namespaces.auth import api as auth
from .namespaces.user import api as users
from .namespaces.me import api as me
from .services.jwt_service import jwt
from .services.csrf_service import CSRF, cors
from .db import db
import os

api = Api()
migrate = Migrate()

def create_app():
    load_dotenv()
    app = Flask(__name__)

    from . import config
    flask_env = os.getenv("FLASK_ENV")
    if flask_env == "production":
        print("production Env")
        app.config.from_object(config.ProductionConfig)
    elif flask_env == "test":
        print("test Env")
        app.config.from_object(config.TestingConfig)
    else:
        print("dev Env")
        app.config.from_object(config.DevelopmentConfig)

    db.init_app(app)
    api.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    CSRF.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(csrf)
    api.add_namespace(auth)
    api.add_namespace(courses)
    api.add_namespace(users)
    api.add_namespace(me)

    return app