import pytest
import os
from flask.testing import FlaskClient
from werkzeug.datastructures import FileStorage
import io

@pytest.fixture
def image():

    path = f"{os.path.dirname(os.path.abspath(__file__))}\\images"

    with open(os.path.join(path,"image.png"), "rb") as file:
        data = file.read()

        buffer = io.BytesIO(data)

        yield FileStorage(stream=buffer, filename="image.png")

        buffer.close()

@pytest.fixture
def courseData(image):
    return {
        "name": "Ensinando Python",
        "language": "Python",
        "description": "any description to the course",
        "image": image
    }