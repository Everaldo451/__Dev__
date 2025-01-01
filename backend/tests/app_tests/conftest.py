import pytest
from flask.testing import FlaskClient
from werkzeug.security import generate_password_hash

@pytest.fixture
def userData():
    return {
        "email": "algum@email.com",
        "password": "algumasenha",
        "username": "algumUsername",
    }

@pytest.fixture
def teacherData(userData):
    userData["is_teacher"] = "on"
    return userData

@pytest.fixture
def studentData(userData):
    return userData

@pytest.fixture
def create_user(client, db_conn, Users, userData):

    userData["password"] = generate_password_hash(userData.get("password"))

    with client.application.app_context():

        try: 
            new_user = Users(**userData)
            
            db_conn.session.add(new_user)
            db_conn.session.commit()
        except Exception as e:
            assert False

        assert new_user is not None

        yield new_user

        db_conn.session.close()
    
@pytest.fixture
def csrf_token(client:FlaskClient):

    response = client.get("/csrf/get")

    json = response.get_json()

    assert response.status_code == 200
    assert json

    yield json["csrf"]


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
    