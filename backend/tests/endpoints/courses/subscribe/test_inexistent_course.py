import pytest
from flask.testing import FlaskClient

def test_inexistent_course(client:FlaskClient,  course_data, register_user):

    access_csrf_token, refresh_csrf_token = register_user

    response = client.patch(f"/me/courses/1",
        headers = {
            "X-CSRF-TOKEN":access_csrf_token.value,
        }
    )

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == "Course not found."
    assert response.status_code == 404
