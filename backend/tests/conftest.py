import sys
import os
import logging

sys.path.append(os.path.dirname(os.path.dirname((os.path.abspath(__file__)))))
print(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask.testing import FlaskClient
from app import create_app
from app.db.models import db, User, Course, UserTypes
from app.security.protect import CSRF
import pytest

@pytest.fixture
def app():
    return create_app(TESTING=True)

@pytest.fixture
def client(app:Flask):
    return app.test_client(True)

@pytest.fixture
def cli_runner(app:Flask):
    return app.test_cli_runner()

@pytest.fixture
def db_conn(client:FlaskClient):
    yield db


@pytest.fixture
def Users():
    return User

@pytest.fixture
def Courses():
    return Course

@pytest.fixture
def UserType():
    return UserTypes

