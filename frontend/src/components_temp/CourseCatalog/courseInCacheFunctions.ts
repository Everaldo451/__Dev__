import { SetStateAction } from "react"
import { CourseType } from "../../types/CourseType"

export type CourseHashMap = {[id:string]: Omit<CourseType, "id">}

export function courseArrayToHashMap(courses: CourseType[]):CourseHashMap{
    const hashMap:CourseHashMap = {}
    courses.forEach((value) => {
        const {id, ...others} = value
        hashMap[String(id)] = others
    })
    return hashMap
}

export function courseHashMapToArray(courseHashMap: CourseHashMap):CourseType[] {
    const coursesArray:CourseType[] = []
    for (const [id, value] of Object.entries(courseHashMap)) {
        coursesArray.push({id:Number(id), ...value})
    }
    return coursesArray
}

// GETTER AND SETTER

export const getState = (coursesInState:CourseHashMap) => {
    return courseHashMapToArray(coursesInState)
}

export const setState = (
    courses:CourseType[], 
    setCoursesInState:React.Dispatch<SetStateAction<CourseHashMap>>
) => {
    setCoursesInState(courseArrayToHashMap(courses))
}




