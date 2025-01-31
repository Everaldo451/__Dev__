import pytest
import os
import io
import magic
from flask.testing import FlaskClient
from werkzeug.datastructures import FileStorage

@pytest.fixture
def image_file_storage():

    path = f"{os.path.dirname(os.path.abspath(__file__))}/images"

    with open(os.path.join(path,"image.png"), "rb") as file:
        data = file.read()

        buffer = io.BytesIO(data)

        yield FileStorage(stream=buffer, filename="image.png")

        buffer.close()


@pytest.fixture
def image_bytes():

    path = f"{os.path.dirname(os.path.abspath(__file__))}/images"

    with open(os.path.join(path,"image.png"), "rb") as file:
        return file.read()
    
@pytest.fixture
def image_mime_type(image_bytes):
    mime = magic.Magic(True)
    return mime.from_buffer(image_bytes)

@pytest.fixture
def common_course_data(Language):
    return {
        "name": "Ensinando Python",
        "language": Language.PYTHON,
        "description": "any description to the course",
        "price": 50
    }

@pytest.fixture
def course_data(common_course_data, image_file_storage):
    common_course_data["image"] = image_file_storage
    common_course_data["language"] = common_course_data["language"].value
    
    return common_course_data

@pytest.fixture
def create_course(client:FlaskClient, db_conn, Courses, common_course_data, image_bytes, image_mime_type):

    common_course_data["image"] = image_bytes
    common_course_data["image_mime_type"] = image_mime_type

    with client.application.app_context():

        try: 
            new_course = Courses(**common_course_data)
            
            db_conn.session.add(new_course)
            db_conn.session.commit()
        except Exception as e:
            assert e is None
            assert False

        assert new_course is not None
        assert new_course.image is not None

        yield new_course

        db_conn.session.close()