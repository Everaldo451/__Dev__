import styles from "./index.module.css"
import { useContext, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import CourseCatalog from "../../Components/CourseCatalog"
import { User } from "../../MainContexts"
import { courseListImagesToBlobURL } from "../../utils/courseListModifiers"
import Historia from "../../assets/historia.png"


export default function CourseSearch() {

    const [user, setUser] = useContext(User)
    const {name} = useParams()
    const [cachedCourses, setCachedCourses] = useState(new Set([
        {
            id:1,
            language: "Python",
            name: "Ensinando Python",
            teachers:"Professor Everaldo",
            image: Historia
        },
        {
            id:1,
            language: "Python",
            name: "Ensinando Python",
            teachers:"Professor Everaldo",
            image: Historia
        },
        {
            id:1,
            language: "Python",
            name: "Ensinando Python",
            teachers:"Professor Everaldo",
            image: Historia
        },
        {
            id:1,
            language: "Python",
            name: "Ensinando Python",
            teachers:"Professor Everaldo",
            image: Historia
        },
        {
            id:1,
            language: "Python",
            name: "Ensinando Python",
            teachers:"Professor Everaldo",
            image: Historia
        },
        {
            id:1,
            language: "Python",
            name: "Ensinando Python",
            teachers:"Professor Everaldo",
            image: Historia
        }
    ]))

    async function GetCourse(filters, courseState) {

        const [courseList, setCourseList] = courseState

        try {

            const response = await axios.get(`/api/courses/search${filters}`)

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
            <CourseCatalog 
                filters={[["name", name]]} 
                subscribe={true} 
                userArea={false} 
                repeatFunction={GetCourse} 
                courseStateOrContext={[cachedCourses, setCachedCourses]}
            />
        </main>
    </>
    )

}