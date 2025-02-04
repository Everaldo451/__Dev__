from flask.testing import FlaskClient

def test_success(client:FlaskClient, csrf_token, register_user, subscribe_course):

   
    response=client.delete("/me/courses/1",
        headers={
            "X-CSRFToken": csrf_token
        }
    )

    json=response.get_json()
    message=json.get("message")
    assert message=="User unsubscribed sucessful."
    assert response.status_code==200

