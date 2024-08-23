import styles from "./index.module.css"
import Header from "../../Components/Header"
import { User } from "../../main"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import SearchBar from "../../Components/SearchBar"


function CourseRoute() {

    const [courses, setCourses] = useState([])
    const {name} = useParams()

    async function GetCourse() {
        try {

            const response = await axios.get(`http://localhost:5000/courses/getcourses?name=${name}`)
            const array = []

            if (response.data) {

                for (const course of response.data.courses) {

                    array.push({ 
                        name:course.name,
                        description:course.description,
                        image:course.image,
                        language:course.language,
                        key:courses.length + array.length + 1
                    })

                }

                setCourses(prevCourses => [...prevCourses,...array])

                console.log("ola")
            }

        } catch(error) {}
    }

    useEffect(() => {

        setCourses([])
        GetCourse()

    },[name])

    return (
    <>
        <main className={styles.CourseRoute}>
            <div className={styles.Container}><SearchBar/></div>
            <h2 style={{color:"white"}}>Results</h2>
            <section className={styles.courses}>

                {courses.map(course => 
                <section key={course.key} className={styles.Course}>
                    <img src={course.image} width={100}></img>
                    <p style={{textAlign:"center"}}>{course.name}</p>
                    <p style={{margin:0}}>
                        <span style={{color:"rgb(131, 85, 0)"}}>Language: </span>
                        <span style={{textDecoration:"underline"}}>{course.language}</span>
                    </p>
                    <p>{course.description}</p>
                </section>)}

            </section>
        </main>
    </>
    )

}


export default CourseRoute