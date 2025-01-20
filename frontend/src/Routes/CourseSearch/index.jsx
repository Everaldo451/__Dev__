import styles from "./index.module.css"
import { useContext, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import SearchBar from "../../Components/SearchBar"
import CourseCatalog from "../../Components/CourseCatalog"
import { User, Courses } from "../../MainContexts"
import { courseListImagesToBlobURL } from "../../utils/courseListModifiers"


export default function CourseSearch() {

    const [user, setUser] = useContext(User)
    const {name} = useParams()
    const [cachedCourses, setCachedCourses] = useState(new Set([]))

    async function GetCourse(filters, courseState) {

        const [courseList, setCourseList] = courseState

        try {

            const response = await axios.get(`/api/courses/getcourses${filters}`)

            if (response.data && response.data.courses instanceof Object) {
                const courses = response.data.courses

                setCourseList(prevCourses => [
                    ...prevCourses,
                    ...courseListImagesToBlobURL(courses).map((course, index, array) => {
                        return {...course, key:courseList.length + array.length + 1}
                    })
                ])

            }
        } catch(error) {console.log(error)}
    }

    return (
    <>
        <main className={styles.CourseRoute}>
            <div className={styles.Container}><SearchBar/></div>
            <CourseCatalog 
                filters={[["name", name]]} 
                subscribe={true} 
                area={false} 
                repeatFunction={GetCourse} 
                courseStateOrContext={[cachedCourses, setCachedCourses]}
            />
        </main>
    </>
    )

}