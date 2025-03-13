from flask.testing import FlaskClient

def test_invalid_credentials(client:FlaskClient, course_data, teacher_data, register_user):

    access_csrf_token, refresh_csrf_token = register_user
    course_data.pop("name")

    response = client.post("/courses",
        content_type = "multipart/form-data",
        data = course_data,
        headers = {
            "X-CSRF-TOKEN":access_csrf_token,
        }
    )

    json = response.get_json()
    print(json)
    assert json
    message = json["message"]
    assert message == "Input payload validation failed"
    errors = json["errors"]
    name_error = errors["name"]
    assert name_error
    assert response.status_code == 400