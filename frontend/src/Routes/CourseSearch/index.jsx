import styles from "./index.module.css"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import SearchBar from "../../Components/SearchBar"
import CourseCatalog from "../../Components/CourseCatalog"
import { User, Courses } from "../../MainContexts"


export default function CourseSearch() {

    const [searchCourses, setSearchCourses] = useState([])
    const [user, setUser] = useContext(User)
    const [courses, setCourses] = useContext(Courses)
    const {name} = useParams()

    async function GetCourse() {
        try {

            const response = await axios.get(`/api/courses/getcourses/${name}`)
            const array = []

            if (response.data) {

                for (const course of response.data.courses) {
                    array.push({...course, key:searchCourses.length + array.length + 1})
                }

                setSearchCourses(prevCourses => [
                    ...prevCourses,
                    ...array
                    .filter((course, index) => 
                        user?
                            !courses.find((courseValue, courseIndex) => courseValue.id == course.id)
                            :true
                    )
                ])

            }

        } catch(error) {}
    }

    useEffect(() => {
        setSearchCourses([])
        GetCourse()
    },[name])

    return (
    <>
        <main className={styles.CourseRoute}>
            <div className={styles.Container}><SearchBar/></div>
            <CourseCatalog courses={searchCourses} subscribe={true} area={false}/>
        </main>
    </>
    )

}