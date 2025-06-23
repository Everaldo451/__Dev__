from flask.testing import FlaskClient

def test_student_success(client:FlaskClient, student_data):

    response = client.post("/users",data=student_data)

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "User created successful."
    assert response.status_code == 200
    assert json.get("csrf_token_cookies")


def test_teacher_success(client:FlaskClient, teacher_data):

    response = client.post("/users",data=teacher_data)

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "User created successful."
    assert response.status_code == 200
    assert json.get("csrf_token_cookies")
    
