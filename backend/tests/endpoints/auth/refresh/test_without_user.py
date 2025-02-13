from flask.testing import FlaskClient

def test_without_user(client:FlaskClient):

    response=client.post("/auth/refresh")

    assert response.status_code==401