from flask.testing import FlaskClient

def test_inexistent_course(client:FlaskClient, register_user, subscribe_course):

    access_csrf_token, refresh_csrf_token = register_user

    response=client.delete("/me/courses/2",
        headers={
            "X-CSRF-TOKEN":access_csrf_token.value,
        }
    )

    json=response.get_json()
    message=json.get("message")
    assert message=="Course not found."
    assert response.status_code==404

