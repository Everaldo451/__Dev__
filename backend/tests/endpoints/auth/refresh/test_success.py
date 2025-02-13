from flask.testing import FlaskClient

def test_success(client:FlaskClient, register_user):

    access_token, refresh_token = register_user

    response = client.post("/auth/refresh",
        headers={
            "X-CSRF-TOKEN": refresh_token.value
        }
    )
    
    assert response.status_code==200