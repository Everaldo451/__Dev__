import pytest
from flask.testing import FlaskClient
from werkzeug.security import generate_password_hash

@pytest.fixture
def userData():
    return {
        "email": "algum@email.com",
        "password": "algumasenha",
        "full_name": "Everaldo Veloso Cavalcanti Junior",
    }

@pytest.fixture
def teacherData(userData):
    userData["is_teacher"] = "on"
    return userData

@pytest.fixture
def studentData(userData):
    return userData

@pytest.fixture
def create_user(client:FlaskClient, db_conn, Users, userData):

    userData["password"] = generate_password_hash(userData.get("password"))

    splitted_name = userData["full_name"].split(maxsplit=1)
    first_name = splitted_name[0]
    last_name = splitted_name[1]

    with client.application.app_context():

        try: 
            new_user = Users(
                email=userData["email"],
                password=userData["password"],
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
    assert response.status_code == 200
    response.close()
    response = client.post("/jwt/refresh",
        headers = {
            "X-CSRFToken":csrf_token,
        }
    )
    assert response.status_code == 200
    response.close()
    response = client.post("/user/",
        headers = {
            "X-CSRFToken":csrf_token,
        }
    )

    json = response.get_json()
    assert json
    user_type = json["user_type"]
    
    if userData.get("is_teacher"):
        assert user_type == "teacher"
        print("is_teacher")
    else:
        assert user_type == "student"
        print("is_student")

    yield
    