from flask.testing import FlaskClient
import pytest

@pytest.fixture
def subscribe_course(client:FlaskClient, create_course, register_user):

    access_csrf_token, refresh_csrf_token = register_user

    client.patch("/me/courses/1",
        headers={
            "X-CSRF-TOKEN": access_csrf_token.value
        }
    )