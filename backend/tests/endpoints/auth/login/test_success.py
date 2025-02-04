from flask.testing import FlaskClient

def test_success(client:FlaskClient, csrf_token, create_user, user_data):

    user_data.pop("full_name")

    response = client.post("/auth/signin",
        data=user_data,
        headers={
            'X-CSRFToken': csrf_token
        },
    )

    json = response.get_json()

    assert json
    message = json["message"]
    assert message == "Login successful."
    assert response.status_code == 200

    response.close()
    assert client.get_cookie("refresh_token")