from flask.testing import FlaskClient

def test_email_change_success(client:FlaskClient, student_data, register_user):
    access_csrf_token, refresh_csrf_token = register_user

    response=client.patch("/me",
        data = {"email": "jorge@gmail.com"},
        headers = {
            "X-CSRF-TOKEN":access_csrf_token,
        }
    )

    json=response.get_json()
    assert json.get("message")=="The attribute was changed successful."
    assert response.status_code==200
    response.close()

    response=client.get("/me")
    json=response.get_json()
    assert json.get("id")==1
    assert json.get("full_name")==student_data.get("full_name")
    assert json.get("email")!=student_data.get("email")
    assert json.get("user_type")=="student"
