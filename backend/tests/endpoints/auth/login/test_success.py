from flask.testing import FlaskClient

def test_success(client:FlaskClient, create_user, user_data):

    user_data.pop("full_name")

    response = client.post("/auth/signin",data=user_data)

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "Login successful."
    assert response.status_code == 200

    response.close()
    assert client.get_cookie("refresh_token")