import pytest
from flask.testing import FlaskClient

def test_inexistent_course(client:FlaskClient, csrf_token, create_course, course_data, register_user):

    response = client.patch(f"/me/courses/2",
        headers = {
            "X-CSRFToken": csrf_token
        }
    )

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == "Course not found."
    assert response.status_code == 404
