import pytest
from flask.testing import FlaskClient

def test(client:FlaskClient, csrf_token, create_user, user_data):

    response = client.post("/users",
        data=user_data,
        headers={
            'X-CSRFToken': csrf_token
        },
    )

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "Current email is already registered."
    assert response.status_code == 400
