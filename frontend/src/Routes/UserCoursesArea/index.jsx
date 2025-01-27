import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { User, Courses } from "../../MainContexts";
import CourseCatalog from "../../Components/CourseCatalog";
import { courseListImagesToBlobURL } from "../../utils/courseListModifiers";
import styles from "./index.module.css"


export default function UserCoursesArea() {

    const [user, setUser] = useContext(User)
    const [userCourses, setUserCourses] = useContext(Courses)
    console.log(user)

    async function GetUserCourses(filters, courseState) {

        const [courseList, setCourseList] = courseState

        try {
            const response = await axios.get(`/api/me/courses${filters}`)

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

    if (user) {

        return (
            <main className={styles.Area}>
                <CourseCatalog 
                    filters={[]} 
                    subscribe={false} 
                    userArea={true}
                    repeatFunction={GetUserCourses}
                    courseStateOrContext={[userCourses, setUserCourses]} 
                />
            </main>
        )

    }

    return <Navigate to="/"/>
}