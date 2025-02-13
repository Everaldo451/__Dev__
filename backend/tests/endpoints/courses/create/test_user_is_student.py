import pytest
from flask.testing import FlaskClient

def test_user_is_student(client:FlaskClient, course_data, user_data, register_user):

    access_csrf_token, refresh_csrf_token = register_user

    response = client.post("/courses",
        content_type = "multipart/form-data",
        data = course_data,
        headers = {
            "X-CSRF-TOKEN":access_csrf_token.value,
        }
    )

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == "Students cannot create a course."
    assert response.status_code == 403