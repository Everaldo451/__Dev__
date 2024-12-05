from flask import Flask, request, redirect, flash
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .models import db
from .api.security.csrf import csrf, csrf_routes
from .api.application.courses import courses
from .api.application.auth import auth
from .api.application.jwt import jwt
import re


def create_app():

    app = Flask(__name__,instance_relative_config=True)
    app.config.from_pyfile("settings.py")

    CORS(app, origins="http://localhost:5173",supports_credentials=True)

    @app.before_request
    def before():
        args = request.args or request.form
        if args:
            for key, value in args.items():
                if re.search("<.*>.*</.*>",value) or re.search("<.*/>",value) or re.search("<.*>",value) or re.search("</.*>",value):
                    flash("Error")
                    return redirect("http://localhost:5173"), 302       
   
    

    csrf.init_app(app)
    db.init_app(app)
    JwtManager = JWTManager(app)

    app.register_blueprint(csrf_routes)
    app.register_blueprint(auth)
    app.register_blueprint(courses)
    app.register_blueprint(jwt)


    with app.app_context():
     
        db.create_all()

    return app