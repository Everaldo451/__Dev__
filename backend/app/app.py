from flask import Flask, request
from flask_migrate import Migrate
from dotenv import load_dotenv
from .security.protect import CSRF, Cors
from .security.csrf_blueprint import csrf_routes
from .routes.courses import course_routes
from .routes.auth import auth
from .routes.jwt import jwt, JWT
from .routes.user import user_routes
from .db import db
import os

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
    migrate.init_app(app, db)
    Cors.init_app(app)
    CSRF.init_app(app)
    JWT.init_app(app)

    app.register_blueprint(csrf_routes)
    app.register_blueprint(jwt)
    app.register_blueprint(auth)
    app.register_blueprint(course_routes)
    app.register_blueprint(user_routes)

    return app