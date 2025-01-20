import pytest
from flask.testing import FlaskClient

def test_without_csrf_token(client:FlaskClient, userData):

    response = client.post("/auth/register",
        data = userData
    )

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "error"
    assert response.status_code == 400