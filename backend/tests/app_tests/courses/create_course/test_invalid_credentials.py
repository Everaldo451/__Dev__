from flask.testing import FlaskClient

def test_invalid_credentials(client:FlaskClient, csrf_token, teacherData, register_user_and_log_in):

    courseData = {
        "name": "Ensinando Python",
        "language": "python",
        "description": "any description to the course",
    }

    response = client.post("/courses/create",
        data = courseData,
        headers = {
            "X-CSRFToken":csrf_token,
        }
    )

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == "Invalid credentials"
    assert response.status_code == 400