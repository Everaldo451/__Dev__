import { Languages } from "../enums/Languages"

export type CourseType = {
    id: number,
    name: string,
    language: Languages,
    image: string,
    image_mime_type: string,
    date_created: string,
    student_count: number,
    teachers: string[],
    price: string,
}