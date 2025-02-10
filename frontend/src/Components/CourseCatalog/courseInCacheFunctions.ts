import { SetStateAction } from "react"
import { CourseType } from "../../types/CourseType"

/*
function commonSetFunction(courses:CourseType[], coursesSet:Set<CourseType>) {
    courses.forEach(value => {coursesSet.add(value)})
    return [...coursesSet].sort((course1, course2) => course2.id - course1.id)
}
*/

export const getState = (coursesInState:Set<CourseType>) => {
    return [...coursesInState]
}

export const setState = (
    courses:CourseType[], 
    setCoursesInState:React.Dispatch<SetStateAction<Set<CourseType>>>
) => {
    setCoursesInState(new Set(courses))
}