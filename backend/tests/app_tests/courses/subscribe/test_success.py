import pytest
from flask.testing import FlaskClient

def test_success(client:FlaskClient, csrf_token, create_course, courseData, register_user_and_log_in):

    response = client.post(f"/courses/subscribe/1",
        headers = {
            "X-CSRFToken": csrf_token
        }
    )

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == "User registered sucessfull."
    assert response.status_code == 200
