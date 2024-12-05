import styles from "./index.module.css"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import SearchBar from "../../Components/SearchBar"
import SearchResults from "../../Components/SearchResults"
import { AccessToken, User } from "../../main"


function CourseRoute() {

    const [courses, setCourses] = useState([])
    const token = useContext(AccessToken)
    const user = useContext(User)
    console.log(user)
    const {name} = useParams()

    async function GetCourse() {
        try {

            const response = await axios.get(`http://localhost:5000/courses/getcourses/${name}`)
            const array = []

            if (response.data) {

                for (const course of response.data.courses) {
                    array.push({...course, key:courses.length + array.length + 1})
                }

                setCourses(prevCourses => [
                    ...prevCourses,
                    ...array.filter((course, index) => 
                        user?
                            !user.courses.find((courseValue, courseIndex) => 
                                courseValue.id == course.id
                            )
                        :true
                    )
                ])

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
            <SearchResults courses={courses} subscribe={true} area={false}/>
        </main>
    </>
    )

}


export default CourseRoute