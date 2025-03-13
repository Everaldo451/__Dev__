from flask.testing import FlaskClient

def test_with_user(client:FlaskClient, create_course, common_course_data, register_user):

    access_csrf_token, refresh_csrf_token = register_user

    response = client.patch(f"/me/courses/1",
        headers = {
            "X-CSRF-TOKEN":access_csrf_token,
        }
    )
    response.close()
    courseName = common_course_data["name"][:4]
    response = client.get(f"/courses/search?length=0&name={courseName}&price=0,1000")

    json = response.get_json()
    assert json
    courses = json["courses"]
    assert isinstance(courses, list)
    assert len(courses) == 0


def test_without_user(client:FlaskClient, create_course, common_course_data):

    courseName = common_course_data["name"][:4]
    response = client.get(f"/courses/search?length=0&name={courseName}&price=0,1000")

    json = response.get_json()
    assert json
    courses = json["courses"]
    assert isinstance(courses, list)
    assert len(courses) == 1