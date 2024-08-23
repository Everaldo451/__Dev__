from flask import Flask, request, redirect, flash
from flask_cors import CORS
from .models import db
from .api.security.csrf import csrf, csrf_routes
from .api.application.courses import courses
from .api.application.auth import auth
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
                print(key,value)
                if re.search("<.*>.*</.*>",value) or re.search("<.*/>",value) or re.search("<.*>",value) or re.search("</.*>",value):
                    flash("Error")
                    return redirect("http://localhost:5173"), 302       
   
    

    csrf.init_app(app)
    db.init_app(app)


    app.register_blueprint(csrf_routes)
    app.register_blueprint(auth)
    app.register_blueprint(courses)

    with app.app_context():
        db.create_all()

    app.db = db

    return app