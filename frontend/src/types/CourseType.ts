import { Languages } from "../enums/Languages"
import { ValueOf } from "./ValueOf"

export type CourseType = {
    id: number,
    name: string,
    language: ValueOf<typeof Languages>,
    image: string,
    image_mime_type: string,
    date_created: string,
    student_count: number,
    teachers: string[],
    price: string,
}