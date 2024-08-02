import styles from "./index.module.css"
import Header from "../../Components/Header"
import { User } from "../../main"
import { useEffect, useState } from "react"
import axios from "axios"

function Course({name, description, foto}) {

    return (
        <>
            <section className={styles.course}>
                <img src={foto?foto:""}></img>
                <h2>{name}</h2>
                <p>{description}</p>
            </section>
        </>
    )

}


function CourseRoute() {

    const [courses, setCourses] = useState([])

    window.location.search?
        useEffect(async () => {
            const params = new URLSearchParams(window.location.search)
            const response = await axios.get(`http://localhost:5000/api/getcourses?name=${params.get("course")}`)
            const array = []

            if (response.data) {

                for (const course of response.data) {

                    array.push(<Course name={course.name} description={course.description} foto={course.foto}/>)

                }

                setCourses(array)
            }
        },[])
    :
        null


    return (
    <>
        <Header/>
        <main className={styles.CourseRoute}>

        </main>
    </>
    )

}


export default CourseRoute