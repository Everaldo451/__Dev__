import logging.config
from flask import Flask
from flask_migrate import Migrate
from dotenv import load_dotenv

from .repositories.redis import RedisRepository

from .initializers.routers import initialize_api_routers
from .initializers.cors import cors_initializer
from .initializers.jwt_manager import jwt_manager_initializer
from .initializers.environment import environment_initializer
from .middlewares.after.request_log import request_log

import logging
from .api import api
from .db import db

import os
import redis

migrate = Migrate()

def create_app():
    load_dotenv()
    app = Flask(__name__)

    cors = cors_initializer(os.getenv("FRONT_DOMAIN"), os.getenv("FRONT_PORT"))
    jwt_manager = jwt_manager_initializer(
        RedisRepository(redis.StrictRedis(
            os.getenv("REDIS_DOMAIN"), port=os.getenv("REDIS_PORT"), db=0, decode_responses=True
        ))
    )

    app.config.from_object(environment_initializer(os.getenv("FLASK_ENV")))
    logging.config.dictConfig(app.config.get("LOGGER"))

    db.init_app(app)
    api.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    jwt_manager.init_app(app)

    initialize_api_routers(api)

    app.after_request(request_log)

    return app