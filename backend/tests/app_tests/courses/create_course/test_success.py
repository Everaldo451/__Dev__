from flask.testing import FlaskClient

def test_success(client:FlaskClient, csrf_token, userData):

    response = client.post("/auth/register",
        data=userData,
        headers={
            "X-CSRFToken":csrf_token
        },
    )

    response.close()
    assert client.get_cookie("csrf_refresh_token")

    response = client.post("/jwt/refresh_token",
        headers = {
            "X-CSRFToken":csrf_token,
            "X-CSRF-REFRESH": client.get_cookie("csrf_refresh_token")
        }
    )

    assert response.status_code == 200
    response.close()
    assert client.get_cookie("access_token")