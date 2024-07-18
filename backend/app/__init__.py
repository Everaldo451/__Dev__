from flask import Flask, request, redirect, flash
from .models import db
from .api.security.csrf import csrf, csrf_routes
from .api.security.cors import cors
import re

def create_app():

    app = Flask(__name__,instance_relative_config=True)
    app.config.from_pyfile("settings.py")

    app.register_blueprint(csrf_routes)

    @app.before_request
    def before():
        args = request.args or request.form
        if args:
            for key, value in args.items():
                print(key,value)
                if re.search("<.*>.*</.*>",value) or re.search("<.*/>",value) or re.search("<.*>",value) or re.search("</.*>",value):
                    flash("Error")
                    return redirect(request.origin)

            

    cors.init_app(app)
    csrf.init_app(app)
    db.init_app(app)


    return app