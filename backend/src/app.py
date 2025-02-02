from flask import Flask
from flask_wtf.csrf import CSRFProtect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restx import Api
from dotenv import load_dotenv
from .services.jwt_service import jwt
from .initializers.controllers import initialize_api_controllers
from .db import db
import os

cors = CORS(origins="http://localhost:3000", supports_credentials=True)
CSRF = CSRFProtect()
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

    initialize_api_controllers(api)
    return app