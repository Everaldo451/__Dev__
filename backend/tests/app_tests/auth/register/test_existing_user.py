import pytest
from flask.testing import FlaskClient

def test_existing_email(client:FlaskClient, csrf_token, create_user, userData):

    response = client.post("/users",
        data=userData,
        headers={
            'X-CSRFToken': csrf_token
        },
    )

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "Current email is already registered."
    assert response.status_code == 400
