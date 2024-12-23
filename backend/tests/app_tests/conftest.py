import pytest
import logging
from flask.testing import FlaskClient
from werkzeug.security import generate_password_hash

@pytest.fixture
def userData(client):
    return {
        "email": "algum@email.com",
        "password": "algumasenha",
        "username": "algumUsername",
    }


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
    