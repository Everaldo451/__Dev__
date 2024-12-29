import pytest
import os
from flask.testing import FlaskClient

@pytest.fixture
def userData(userData):
    userData["is_teacher"] = "on"
    return userData


@pytest.fixture
def create_user_and_tokens(client:FlaskClient, userData, csrf_token):

    response = client.post("/auth/register",
        data=userData,
        headers={
            "X-CSRFToken":csrf_token
        },
    )

    response.close()

    csrf_refresh_token = client.get_cookie("csrf_refresh_token")
    assert csrf_refresh_token

    response = client.post("/jwt/refresh_token",
        headers = {
            "X-CSRFToken":csrf_token,
            "X-CSRF-REFRESH": csrf_refresh_token.value
        }
    )

    response.close()

    csrf_access_token = client.get_cookie("csrf_access_token")
    assert csrf_access_token

    return csrf_token, csrf_refresh_token, csrf_access_token



@pytest.fixture
def image():

    path = f"{os.path.dirname(os.path.abspath(__file__))}\\images"

    #assert os.path.exists(os.path.join(path,"image.png"))

    with open(os.path.join(path,"image.png"), "rb") as file:
        return file.read()