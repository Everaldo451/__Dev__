import { Languages } from "../enums/Languages"
import { LoadEnumValues } from "./LoadEnumValues"

export type CourseType = {
    id: number,
    name: string,
    language: LoadEnumValues<Languages>,
    image: string,
    image_mime_type: string,
    date_created: string,
    student_count: number,
    teachers: string[],
    price: string,
}