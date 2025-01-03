import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { User, Courses } from "../../MainContexts";
import axios from "axios";
import styles from "./index.module.css"
import CourseCatalog from "../../Components/CourseCatalog";

export default function UserCoursesArea() {

    const [user, setUser] = useContext(User)
    const [courses, setCourses] = useContext(Courses)
    console.log(user)

    if (user) {

        return (
            <main className={styles.Area}>
                <CourseCatalog courses={courses?courses:[]} subscribe={false} area={true}/>
            </main>
        )

    }

    return <Navigate to="/"/>
}