from flask.testing import FlaskClient

def test_invalid_credentials(client:FlaskClient, create_user_and_tokens):

    csrf_common_token, csrf_refresh_token, csrf_access_token = create_user_and_tokens

    courseData = {
        "name": "Ensinando Python",
        "language": "python",
        "description": "any description to the course",
    }

    response = client.post("/courses/create",
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