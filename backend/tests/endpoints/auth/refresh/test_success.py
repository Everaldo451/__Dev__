from flask.testing import FlaskClient

def test_success(client:FlaskClient, csrf_token, register_user):

    response = client.post("/auth/refresh",
        headers={
            "X-CSRFToken": csrf_token
        }
    )
    
    assert response.status_code==200