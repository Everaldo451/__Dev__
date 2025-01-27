from flask import Flask, request
from flask_migrate import Migrate
from dotenv import load_dotenv
from .routes.csrf import csrf
from .routes.courses import courses
from .routes.auth import auth
from .routes.user import users
from .routes.me import me
from .services.jwt_service import JWT
from .services.csrf_service import CSRF, Cors
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

    app.register_blueprint(csrf)
    app.register_blueprint(auth)
    app.register_blueprint(courses)
    app.register_blueprint(users)
    app.register_blueprint(me)

    return app