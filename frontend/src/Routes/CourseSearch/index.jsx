import styles from "./index.module.css"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import SearchBar from "../../Components/SearchBar"
import CourseCatalog from "../../Components/CourseCatalog"
import { User, Courses } from "../../MainContexts"


export default function CourseSearch() {

    const [user, setUser] = useContext(User)
    const {name} = useParams()

    async function GetCourse(params, courseState) {

        const [courseList, setCourseList] = courseState

        try {

            //const params = `name=${name}&times=${times}`
            const response = await axios.get(`/api/courses/getcourses?${params}`)
            const courses = response.data.courses

            if (response.data && response.data.courses instanceof Object) {

                setCourseList(prevCourses => [
                    ...prevCourses,
                    ...courses.map((course, index, array) => {
                        return {...course, key:courseList.length + array.length + 1}
                    })
                ])

            }

        } catch(error) {
            console.log(error)
        }
    }

    /*useEffect(() => {
        setSearchCourses([])
        GetCourse(0, 0)
    },[name])*/

    return (
    <>
        <main className={styles.CourseRoute}>
            <div className={styles.Container}><SearchBar/></div>
            <CourseCatalog params={`name=${name}`} subscribe={true} area={false} repeatFunction={GetCourse}/>
        </main>
    </>
    )

}