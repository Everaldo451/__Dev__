import { useState, useContext, SetStateAction } from "react"
import { CourseType } from "../../../types/CourseType"
import Image from "../Image"
import styles from "./index.module.css"

interface CourseProps {
    course: CourseType,
    subscribe: boolean,
    setCurrentCourses: React.Dispatch<SetStateAction<CourseType[]>>
}


export default function Course({course, subscribe, setCurrentCourses}:CourseProps) {

    return (
        <section className={styles.course}>
            <Image src={course.image} className={styles.image}/>
            <section className={styles.data}>
                <h4>{course.name}</h4>
                <p className={styles.language}>Language: {course.language}</p>
                <p className={styles.teachers}>{course.teachers}</p>
                <p className={styles.price}>R$ {Number(course.price)}</p>
            </section>
        </section>
    )

}