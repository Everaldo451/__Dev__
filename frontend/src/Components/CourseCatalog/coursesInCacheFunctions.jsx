function commonSetFunction(courses, coursesSet) {
    courses.forEach(value => {coursesSet.add(value)})
    return [...coursesSet].sort((course1, course2) => course2.id - course1.id)
}

export const getState = (coursesInState) => {
    return [...coursesInState]
}

export const setState = (courses, coursesInState, setCoursesInState) => {
    const newCourseSet = new Set(coursesInState)
    const courseList = commonSetFunction(courses, newCourseSet)
    setCoursesInState(new Set(courseList))
}