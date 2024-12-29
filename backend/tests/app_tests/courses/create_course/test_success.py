from flask.testing import FlaskClient

def test_success(client:FlaskClient, image, create_user_and_tokens):

    csrf_common_token, csrf_refresh_token, csrf_access_token = create_user_and_tokens

    courseData = {
        "name": "Ensinando Python",
        "language": "python",
        "description": "any description to the course",
        "image": (image, "image.png")
    }

    response = client.post("/courses/create",
        content_type = "multipart/form-data",
        data = courseData,
        headers = {
            "X-CSRFToken":csrf_common_token,
            "X-CSRF-ACCESS": csrf_access_token.value,
        }
    )

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == "Invalid credentials"
    assert response.status_code == 400