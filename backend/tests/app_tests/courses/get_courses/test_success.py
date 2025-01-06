from flask.testing import FlaskClient

def test_with_user(client:FlaskClient, csrf_token, create_course, commonCourseData, register_user_and_log_in):

    response = client.post(f"/courses/subscribe/1",
        headers = {
            "X-CSRFToken": csrf_token
        }
    )

    courseName = commonCourseData["name"][:4]

    response = client.get(f"/courses/getcourses/{courseName}")

    json = response.get_json()
    assert json
    courses = json["courses"]

def test_without_user(client:FlaskClient, csrf_token, create_course, commonCourseData):

    courseName = commonCourseData["name"][:4]

    response = client.get(f"/courses/getcourses/{courseName}")

    json = response.get_json()
    assert json
    courses = json["courses"]