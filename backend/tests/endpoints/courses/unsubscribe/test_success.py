from flask.testing import FlaskClient

def test_success(client:FlaskClient, register_user, subscribe_course):

    access_csrf_token, refresh_csrf_token = register_user
   
    response=client.delete("/me/courses/1",
        headers={
            "X-CSRF-TOKEN":access_csrf_token,
        }
    )

    json=response.get_json()
    message=json.get("message")
    assert message=="User unsubscribed sucessful."
    assert response.status_code==200

