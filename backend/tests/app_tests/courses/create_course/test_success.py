from flask.testing import FlaskClient

def test_success(client:FlaskClient, csrf_token, courseData, teacherData, register_user_and_log_in):

    response = client.post("/courses",
        content_type = "multipart/form-data",
        data = courseData,
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

    response = client.get("/auth/logout")
    response.close()

    response = client.get(f"/courses/search?length=0&name={courseData.get("name")}",
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
    assert course.get("image") is not None
    assert "image/png" in image
    assert course.get("users") is None
    assert course.get("student_count") == 0

    teachers = course.get("teachers")
    assert isinstance(teachers, list)

    current_teacher_user = teachers[0]
    assert current_teacher_user == teacherData["full_name"]


