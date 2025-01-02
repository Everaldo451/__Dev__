import pytest
import os
from flask.testing import FlaskClient
from werkzeug.datastructures import FileStorage
import io

@pytest.fixture
def imageFileStorage():

    path = f"{os.path.dirname(os.path.abspath(__file__))}\\images"

    with open(os.path.join(path,"image.png"), "rb") as file:
        data = file.read()

        buffer = io.BytesIO(data)

        yield FileStorage(stream=buffer, filename="image.png")

        buffer.close()


@pytest.fixture
def imageBytes():

    path = f"{os.path.dirname(os.path.abspath(__file__))}\\images"

    with open(os.path.join(path,"image.png"), "rb") as file:
        return file.read()

@pytest.fixture
def commonCourseData(Language):
    return {
        "name": "Ensinando Python",
        "language": Language.PYTHON,
        "description": "any description to the course",
    }

@pytest.fixture
def courseData(commonCourseData, imageFileStorage):
    commonCourseData["image"] = imageFileStorage
    commonCourseData["language"] = commonCourseData["language"].value
    
    return commonCourseData

@pytest.fixture
def create_course(client:FlaskClient, db_conn, Courses, commonCourseData, imageBytes):

    commonCourseData["image"] = imageBytes

    with client.application.app_context():

        try: 
            new_course = Courses(**commonCourseData)
            
            db_conn.session.add(new_course)
            db_conn.session.commit()
        except Exception as e:
            assert e is None
            assert False

        assert new_course is not None

        yield new_course

        db_conn.session.close()