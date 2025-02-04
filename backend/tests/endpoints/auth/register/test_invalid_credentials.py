from flask.testing import FlaskClient

def test(client:FlaskClient, csrf_token, user_data):

    user_data.pop("full_name")

    response = client.post("/users",
        data=user_data,
        headers={
            "X-CSRFToken":csrf_token
        },
    )

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == 'Input payload validation failed'
    assert response.status_code == 400