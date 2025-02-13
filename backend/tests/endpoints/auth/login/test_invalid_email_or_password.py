import pytest
from flask.testing import FlaskClient

def test_invalid_email(client:FlaskClient, create_user, user_data):

    user_data.pop("full_name")
    user_data["email"] = "email@inexistente"

    response = client.post("/auth/signin",data=user_data)

    json = response.get_json()
    
    assert json
    message = json["message"]
    assert message == "Invalid email or password."
    assert response.status_code == 400