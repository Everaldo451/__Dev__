import pytest
from flask.testing import FlaskClient

def test_user_is_student(client:FlaskClient, csrf_token, courseData, userData, register_user_and_log_in):

    response = client.post("/courses/create",
        content_type = "multipart/form-data",
        data = courseData,
        headers = {
            "X-CSRFToken":csrf_token,
        }
    )

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == "User isn't a teacher."
    assert response.status_code == 401