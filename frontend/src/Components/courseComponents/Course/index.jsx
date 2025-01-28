import { useState, useContext } from "react"
import { User, Courses } from "../../../MainContexts"
import { Image } from "../Image"
import styles from "./index.module.css"


export default function Course({course, subscribe, setCurrentCourses}) {

    return (
        <section className={styles.course}>
            <Image src={course.image} className={styles.image}/>
            <section className={styles.data}>
                <h4>{course.name}</h4>
                <p className={styles.language}>Language: {course.language}</p>
                <p className={styles.teachers}>{course.teachers}</p>
                <p className={styles.value}>R$ 50,00</p>
            </section>
        </section>
    )

}