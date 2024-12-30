from flask.testing import FlaskClient

def test_success(client:FlaskClient, image, csrf_token, teacherData, register_user_and_log_in):

    courseData = {
        "name": "Ensinando Python",
        "language": "python",
        "description": "any description to the course",
        "image": image
    }

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
    assert message == "Course created sucessfully."
    assert response.status_code == 200