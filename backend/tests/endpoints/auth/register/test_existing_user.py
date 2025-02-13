import pytest
from flask.testing import FlaskClient

def test(client:FlaskClient, create_user, user_data):

    response = client.post("/users",data=user_data)
    
    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "Current email is already registered."
    assert response.status_code == 400
