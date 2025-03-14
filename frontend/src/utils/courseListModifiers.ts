import { CourseType } from "../types/CourseType";

export const courseImageToBlobURL = (course:CourseType) => {
    let decodedBase64;
    try {
        if (!course.image || !course.image.startsWith("data:image")) {
            throw new Error("invalid image format")
        }
        decodedBase64 = atob(course.image.split(",",1)[1])
    } catch (error) {
        return course
    }

    const uint8Array = new Uint8Array(decodedBase64.length)

    for (let i = 0; i<decodedBase64.length; i++) {
        uint8Array[i] = decodedBase64.charCodeAt(i)
    }

    return {...course, image: URL.createObjectURL(new Blob([uint8Array]))}
}


export const courseListImagesToBlobURL = (courses:CourseType[]) => {
    return courses.map(value => courseImageToBlobURL(value))
}


export const courseListSortByDateTime = (courses:CourseType[]) => {
    courses.sort((course1, course2) => {
        const [course1Timestamp, course2Timestamp] = [
            Date.parse(course1.date_created), 
            Date.parse(course2.date_created)
        ]

        return course2Timestamp - course1Timestamp
    })
}