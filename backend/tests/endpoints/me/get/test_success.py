from flask.testing import FlaskClient

def test_student_success(client:FlaskClient, student_data, register_user):
    response=client.get("/me")
    json=response.get_json()
    assert json.get("id")==1
    assert json.get("full_name")==student_data.get("full_name")
    assert json.get("email")==student_data.get("email")
    assert json.get("user_type")=="student"


def test_teacher_success(client:FlaskClient, teacher_data, register_user):
    response=client.get("/me")
    json=response.get_json()
    assert json.get("id")==1
    assert json.get("full_name")==teacher_data.get("full_name")
    assert json.get("email")==teacher_data.get("email")
    assert json.get("user_type")=="teacher"