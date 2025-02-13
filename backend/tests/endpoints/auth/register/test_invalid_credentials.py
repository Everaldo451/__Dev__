from flask.testing import FlaskClient

def test(client:FlaskClient, user_data):

    user_data.pop("full_name")

    response = client.post("/users",data=user_data)

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == 'Input payload validation failed'
    assert response.status_code == 400