import pytest
from flask.testing import FlaskClient

def test_user_is_student(client:FlaskClient, csrf_token, course_data, user_data, register_user):

    response = client.post("/courses",
        content_type = "multipart/form-data",
        data = course_data,
        headers = {
            "X-CSRFToken":csrf_token,
        }
    )

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == "Students cannot create a course."
    assert response.status_code == 403