from flask.testing import FlaskClient

def test_existing_course(client:FlaskClient, teacher_data, create_course, course_data, register_user):

    access_csrf_token, refresh_csrf_token = register_user

    response = client.post("/courses",
        content_type = "multipart/form-data",
        data = course_data,
        headers = {
            "X-CSRF-TOKEN":access_csrf_token,
        }
    )

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == "Course with the current name already exists."
    assert response.status_code == 409
