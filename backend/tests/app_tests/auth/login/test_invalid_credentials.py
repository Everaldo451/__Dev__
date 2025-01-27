import pytest
from flask.testing import FlaskClient

def test_invalid_credentials(client:FlaskClient, csrf_token, create_user, userData):

    userData.pop("email")

    response = client.post("/auth/signin",
        data=userData,
        headers = {
            "X-CSRFToken": csrf_token
        }
    )

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "Invalid credentials."
    assert response.status_code == 400