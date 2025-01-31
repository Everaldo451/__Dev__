from flask.testing import FlaskClient

def test_student_success(client:FlaskClient, csrf_token, student_data):

    response = client.post("/users",
        data=student_data,
        headers={
            "X-CSRFToken":csrf_token
        },
    )

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "User created successful."
    assert response.status_code == 200


def test_teacher_success(client:FlaskClient, csrf_token, teacher_data):

    response = client.post("/users",
        data=teacher_data,
        headers={
            "X-CSRFToken":csrf_token
        },
    )

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "User created successful."
    assert response.status_code == 200
