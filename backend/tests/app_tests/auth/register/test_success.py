from flask.testing import FlaskClient

def test_student_success(client:FlaskClient, csrf_token, userData):

    response = client.post("/auth/register",
        data=userData,
        headers={
            "X-CSRFToken":csrf_token
        },
    )

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "User created successful."
    assert response.status_code == 200

    response.close()
    assert client.get_cookie("refresh_token")
    assert client.get_cookie("csrf_refresh_token")


def test_teacher_success(client:FlaskClient, csrf_token, userData):

    userData["is_teacher"] = "on"

    response = client.post("/auth/register",
        data=userData,
        headers={
            "X-CSRFToken":csrf_token
        },
    )

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "User created successful."
    assert response.status_code == 200

    response.close()
    assert client.get_cookie("refresh_token")
    assert client.get_cookie("csrf_refresh_token")