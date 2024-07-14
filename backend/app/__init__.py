from flask import Flask
from .models import db
from .api.security.csrf import csrf, csrf_routes
from .api.security.cors import cors

def create_app():

    app = Flask(__name__,instance_relative_config=True)
    app.config.from_pyfile("settings.py")

    app.register_blueprint(csrf_routes)

    cors.init_app(app)
    csrf.init_app(app)
    db.init_app(app)


    return app