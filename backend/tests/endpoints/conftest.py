import pytest
from flask.testing import FlaskClient
from werkzeug.security import generate_password_hash
from flask_jwt_extended.config import config

@pytest.fixture
def user_data():
    return {
        "email": "algum@email.com",
        "password": "algumasenha",
        "full_name": "Everaldo Veloso Cavalcanti Junior",
    }

@pytest.fixture
def teacher_data(user_data):
    user_data["is_teacher"] = "on"
    return user_data

@pytest.fixture
def student_data(user_data):
    return user_data

@pytest.fixture
def create_user(client:FlaskClient, db_conn, Users, user_data):

    user_data["password"] = generate_password_hash(user_data.get("password"))

    splitted_name = user_data["full_name"].split(maxsplit=1)
    first_name = splitted_name[0]
    last_name = splitted_name[1]

    with client.application.app_context():

        try: 
            new_user = Users(
                email=user_data["email"],
                password=user_data["password"],
                first_name=first_name,
                last_name=last_name
            )
            
            db_conn.session.add(new_user)
            db_conn.session.commit()
        except Exception as e:
            assert e is None

        assert new_user is not None
        yield new_user

@pytest.fixture
def register_user(client:FlaskClient, user_data):

    response = client.post("/users",
        data=user_data,
    )
    json = response.get_json()
    assert response.status_code == 200
    csrf_tokens = json.get("csrf_token_cookies")
    assert csrf_tokens
    response.close()


    with client.application.app_context():
        access_csrf_cookie = csrf_tokens[config.access_csrf_cookie_name]
        refresh_csrf_cookie = csrf_tokens[config.refresh_csrf_cookie_name]

        assert access_csrf_cookie and isinstance(access_csrf_cookie, dict)
        assert refresh_csrf_cookie and isinstance(refresh_csrf_cookie, dict)

        yield [access_csrf_cookie.get("value"), refresh_csrf_cookie.get("value")]
    