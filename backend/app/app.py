from flask import Flask
from dotenv import load_dotenv
from .security.protect import CSRF, Cors
from .security.csrf_blueprint import csrf_routes
from .routes.courses import course_routes
from .routes.auth import auth
from .routes.jwt import jwt, JWT
from .db import db
import os

def create_app():
    load_dotenv()
    app = Flask(__name__)

    from . import config
    flask_env = os.getenv("FLASK_ENV")
    if flask_env == "production":
        print("production Env")
        app.config.from_object(config.ProductionConfig)
    elif flask_env == "testing":
        print("test Env")
        app.config.from_object(config.TestingConfig)
    else:
        print("dev Env")
        app.config.from_object(config.DevelopmentConfig)

    print(app.config['DEBUG'])

    Cors.init_app(app)
    CSRF.init_app(app)
    JWT.init_app(app)
    db.init_app(app)

    app.register_blueprint(csrf_routes)
    app.register_blueprint(auth)
    app.register_blueprint(course_routes)
    app.register_blueprint(jwt)

    with app.app_context():
        db.create_all()

    return app