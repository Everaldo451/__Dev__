import pytest
from flask.testing import FlaskClient

def test_success(client:FlaskClient, csrf_token, create_user, userData):

    userData.pop("username")

    response = client.post("/auth/login",
        data=userData,
        headers={
            'X-CSRFToken': csrf_token
        },
    )

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "Login successful."
    assert response.status_code == 200