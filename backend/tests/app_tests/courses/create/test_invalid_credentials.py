from flask.testing import FlaskClient

def test_invalid_credentials(client:FlaskClient, csrf_token, course_data, teacher_data, register_user):

    course_data.pop("name")

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
    assert message == "Input payload validation failed"
    errors = json["errors"]
    name_error = errors["name"]
    assert name_error
    assert response.status_code == 400