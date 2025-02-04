from flask.testing import FlaskClient

def test_inexistent_course(client:FlaskClient, csrf_token, register_user, subscribe_course):

    response=client.delete("/me/courses/2",
        headers={
            "X-CSRFToken": csrf_token
        }
    )

    json=response.get_json()
    message=json.get("message")
    assert message=="Course not found."
    assert response.status_code==404

