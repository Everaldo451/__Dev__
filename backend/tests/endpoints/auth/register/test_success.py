from flask.testing import FlaskClient
from flask_jwt_extended.config import config

def test_student_success(client:FlaskClient, student_data):

    response = client.post("/users",data=student_data)

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "User created successful."
    assert response.status_code == 200

    with client.application.app_context():
        assert client.get_cookie(config.access_csrf_cookie_name)
        assert client.get_cookie(config.refresh_csrf_cookie_name)


def test_teacher_success(client:FlaskClient, teacher_data):

    response = client.post("/users",data=teacher_data)

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "User created successful."
    assert response.status_code == 200

    with client.application.app_context():
        assert client.get_cookie(config.access_csrf_cookie_name)
        assert client.get_cookie(config.refresh_csrf_cookie_name)
