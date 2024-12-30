import pytest
import os
from flask.testing import FlaskClient
from werkzeug.datastructures import FileStorage
import io

@pytest.fixture
def register_user_and_log_in(client:FlaskClient, userData, csrf_token):

    response = client.post("/auth/register",
        data=userData,
        headers={
            "X-CSRFToken":csrf_token
        },
    )

    response.close()

    response = client.post("/jwt/refresh_token",
        headers = {
            "X-CSRFToken":csrf_token,
        }
    )

    response.close()

    response = client.post("/jwt/getuser",
        headers = {
            "X-CSRFToken":csrf_token,
        }
    )

    json = response.get_json()
    assert json
    user_type = json["user_type"]
    
    if userData.get("is_teacher"):
        assert user_type == "TEACHER"
    else:
        assert user_type == "STUDENT"

    yield



@pytest.fixture
def image():

    path = f"{os.path.dirname(os.path.abspath(__file__))}\\images"

    with open(os.path.join(path,"image.png"), "rb") as file:
        data = file.read()

        buffer = io.BytesIO(data)

        yield FileStorage(stream=buffer, filename="image.png")

        buffer.close()