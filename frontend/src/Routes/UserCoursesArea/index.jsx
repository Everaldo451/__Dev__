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

    if (user) {

        return (
            <main className={styles.Area}>
                <CourseCatalog 
                    filters={[]} 
                    subscribe={false} 
                    userArea={true}
                    requestData={{
                        url: "/api/me/courses",
                        method: "GET",
                    }}
                    courseStateOrContext={[userCourses, setUserCourses]} 
                />
            </main>
        )

    }

    return <Navigate to="/"/>
}