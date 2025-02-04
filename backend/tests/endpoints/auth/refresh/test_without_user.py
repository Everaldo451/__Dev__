from flask.testing import FlaskClient

def test_without_user(client:FlaskClient, csrf_token):

    response=client.post("/auth/refresh",
        headers={
            "X-CSRFToken": csrf_token
        }
    )

    assert response.status_code==401