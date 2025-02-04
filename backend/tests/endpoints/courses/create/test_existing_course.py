from flask.testing import FlaskClient

def test_existing_course(client:FlaskClient, csrf_token, teacher_data, create_course, course_data, register_user):

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
    assert message == "Course with the current name already exists."
    assert response.status_code == 400
