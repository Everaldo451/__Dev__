from flask import Flask
from flask.testing import FlaskClient
import pytest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname((os.path.abspath(__file__)))))
print(os.path.dirname(os.path.abspath(__file__)))

from src.app import create_app
from src.db import db
from src.models.user_model import User, UserTypes
from src.models.course_model import Course, Languages

@pytest.fixture
def app():
    return create_app()

@pytest.fixture
def db_conn(app:Flask):
    with app.app_context():
        db.create_all()
        yield db
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app:Flask, db_conn):
    return app.test_client(use_cookies=True)

@pytest.fixture
def cli_runner(app:Flask, db_conn):
    return app.test_cli_runner()

@pytest.fixture
def Users():
    return User

@pytest.fixture
def Courses():
    return Course

@pytest.fixture
def UserType():
    return UserTypes

@pytest.fixture
def Language():
    return Languages

