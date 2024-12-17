import sys
import os
import logging

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
print(os.path.dirname(os.path.abspath(__file__)))
logging.error(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from app import create_app
import pytest
from db.db import connect_db
from db.models import User, Course



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
def db():
    connection = connect_db(TESTING=True)

    yield connection

    if connection:
        connection.rollback()
        connection.close()


@pytest.fixture
def User_Model():
    return User

@pytest.fixture
def Course_Model():
    return Course

