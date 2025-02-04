from flask.testing import FlaskClient

def test_success(client:FlaskClient):
    response=client.get("/csrf")
    assert response.status_code==200