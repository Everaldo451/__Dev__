from flask import Flask
from dotenv import load_dotenv
from .security.protect import CSRF, Cors
from .security.csrf_blueprint import csrf_routes
from .api.courses import course_routes
from .api.auth import auth
from .api.jwt import jwt, JWT
from .db.models import db
import os

def create_app(TESTING = False):
    load_dotenv()
    from .config import settings

    app = Flask(__name__)

    if os.getenv("FLASK_ENV") == "development" and TESTING:
        app.config.from_object(settings.TestingConfig)
    else:
        app.config.from_object(settings.GeneralConfig)

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