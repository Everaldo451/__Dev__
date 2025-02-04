import pytest
from flask.testing import FlaskClient

def test_without_csrf_token(client:FlaskClient, user_data):

    response = client.post("/users",
        data = user_data
    )

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "error"
    assert response.status_code == 400