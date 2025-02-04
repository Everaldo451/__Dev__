from flask.testing import FlaskClient
import pytest

@pytest.fixture
def subscribe_course(client:FlaskClient, create_course, csrf_token):
    client.patch("/me/courses/1",
        headers={
            "X-CSRFToken": csrf_token
        }
    )