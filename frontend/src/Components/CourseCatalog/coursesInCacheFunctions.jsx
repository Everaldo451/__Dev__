function commonSetFunction(courses, coursesSet) {
    courses.forEach(value => {coursesSet.add(value)})

    return [...coursesSet].sort((course1, course2) => course2.id - course1.id)
}

export const getFnIfCache = () => {
    const jsonifiedCourses = localStorage.getItem("courses")

    return jsonifiedCourses?JSON.parse(jsonifiedCourses):[]
}

export const setFnIfCache = (courses) => {
    const coursesInCache = new Set(getFnIfCache())
    const courseList = commonSetFunction(courses, coursesInCache)
    localStorage.setItem("courses", JSON.stringify(courseList))
}

export const getFnIfState = (coursesInState) => {
    return [...coursesInState]
}

export const setFnIfState = (courses, coursesInState, setCoursesInState) => {
    const newCourseSet = new Set(coursesInState)
    const courseList = commonSetFunction(courses, newCourseSet)
    setCoursesInState(new Set(courseList))
}