from flask.testing import FlaskClient

def test_existing_course(client:FlaskClient, csrf_token, teacherData, create_course, courseData, register_user_and_log_in):

    response = client.post("/courses/create",
        content_type = "multipart/form-data",
        data = courseData,
        headers = {
            "X-CSRFToken":csrf_token,
        }
    )

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == "Course with the current name already exists."
    assert response.status_code == 400
