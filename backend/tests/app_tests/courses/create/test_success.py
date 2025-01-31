from flask.testing import FlaskClient

def test_success(client:FlaskClient, csrf_token, course_data, teacher_data, register_user):

    response = client.post("/courses",
        content_type = "multipart/form-data",
        data = course_data,
        headers = {
            "X-CSRFToken":csrf_token,
        }
    )

    json = response.get_json()
    assert json
    message = json["message"]
    assert message == "Course created sucessfully."
    course = json["course"]
    assert course
    assert response.status_code == 200

    response.close()

    response = client.post("/auth/logout",
        headers = {
            "X-CSRFToken":csrf_token,
        }
    )
    response.close()

    response = client.get(f"/courses/search?length=0&name={course_data.get("name")}",
        headers = {
            "X-CSRFToken": csrf_token
        }
    )

    json = response.get_json()

    courses = json["courses"]
    assert isinstance(courses, list)

    course = courses[0]
    assert isinstance(course, dict)
    assert course.get("name") is not None
    assert course.get("language") is not None
    image = course.get("image") 
    assert image is not None
    assert "image/png" in image
    assert course.get("users") is None
    assert course.get("price") is not None
    assert course.get("student_count") == 0

    teachers = course.get("teachers")
    assert isinstance(teachers, list)

    current_teacher_user = teachers[0]
    assert current_teacher_user == teacher_data["full_name"]


