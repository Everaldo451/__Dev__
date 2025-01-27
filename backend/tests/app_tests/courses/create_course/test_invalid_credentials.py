from flask.testing import FlaskClient

def test_invalid_credentials(client:FlaskClient, csrf_token, courseData, teacherData, register_user_and_log_in):

    courseData.pop("name")

    response = client.post("/courses",
        content_type = "multipart/form-data",
        data = courseData,
        headers = {
            "X-CSRFToken":csrf_token,
        }
    )

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == "Invalid credentials."
    assert response.status_code == 400