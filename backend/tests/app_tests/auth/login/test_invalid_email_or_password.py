import pytest
from flask.testing import FlaskClient

def test_invalid_email(client:FlaskClient, csrf_token, create_user, userData):

    userData.pop("full_name")
    userData["email"] = "email@inexistente"

    response = client.post("/auth/login",
        data=userData,
        headers = {
            "X-CSRFToken":csrf_token
        }
    )

    json = response.get_json()
    
    assert json
    message = json["message"]
    assert message == "Invalid email or password."
    assert response.status_code == 400