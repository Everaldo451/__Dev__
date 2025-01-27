from flask.testing import FlaskClient

def test_with_user(client:FlaskClient, csrf_token, create_course, commonCourseData, register_user_and_log_in):

    response = client.patch(f"/me/courses/1",
        headers = {
            "X-CSRFToken": csrf_token
        }
    )
    response.close()
    courseName = commonCourseData["name"][:4]
    response = client.get(f"/courses/search?length=0&name={courseName}")

    json = response.get_json()
    assert json
    courses = json["courses"]
    assert isinstance(courses, list)
    assert len(courses) == 0

def test_without_user(client:FlaskClient, csrf_token, create_course, commonCourseData):

    courseName = commonCourseData["name"][:4]
    response = client.get(f"/courses/search?length=0&name={courseName}",)

    json = response.get_json()
    assert json
    courses = json["courses"]
    assert isinstance(courses, list)
    assert len(courses) == 1