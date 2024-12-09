from flask import Flask, request, redirect, flash
from dotenv import load_dotenv
from flask_cors import CORS
import re
import os
from flask_jwt_extended import JWTManager
from .db.models import db
from .api.security.csrf import csrf, csrf_routes
from .api.application.courses import courses
from .api.application.auth import auth
from .api.application.jwt import jwt


def create_app(TESTING = False):
    from .config import settings
    load_dotenv()

    app = Flask(__name__)

    if os.getenv("FLASK_ENV") == "development" and TESTING:
        app.config.from_object(settings.TestingConfig)
    else:
        app.config.from_object(settings.GeneralConfig)

    CORS(app, origins="http://localhost:5173",supports_credentials=True)

    csrf.init_app(app)
    db.init_app(app)
    JwtManager = JWTManager(app)

    app.register_blueprint(csrf_routes)
    app.register_blueprint(auth)
    app.register_blueprint(courses)
    app.register_blueprint(jwt)

    @app.before_request
    def before():
        args = request.args or request.form
        if args:
            for key, value in args.items():
                if re.search("<.*>.*</.*>",value) or re.search("<.*/>",value) or re.search("<.*>",value) or re.search("</.*>",value):
                    flash("Error")
                    return redirect("http://localhost:5173"), 302      


    @app.after_request
    def after(response):
        db.session.close_all()
        return response


    with app.app_context():
     
        db.create_all()

    return app