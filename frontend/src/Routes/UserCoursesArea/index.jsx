import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { User, Courses } from "../../MainContexts";
import axios from "axios";
import styles from "./index.module.css"
import CourseCatalog from "../../Components/CourseCatalog";

export default function UserCoursesArea() {

    const [user, setUser] = useContext(User)
    const [userCourses, setUserCourses] = useContext(Courses)
    console.log(user)

    async function GetUserCourses(filters, courseState) {

    }

    if (user) {

        return (
            <main className={styles.Area}>
                <CourseCatalog 
                    filters={[]} 
                    subscribe={false} 
                    area={true}
                    repeatFunction={GetUserCourses}
                    courseStateOrContext={[userCourses, setUserCourses]} 
                />
            </main>
        )

    }

    return <Navigate to="/"/>
}