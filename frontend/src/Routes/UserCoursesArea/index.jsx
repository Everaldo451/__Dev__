import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { User, Courses } from "../../MainContexts";
import CourseCatalog from "../../Components/CourseCatalog";
import { courseListImagesToBlobURL } from "../../utils/courseListModifiers";
import styles from "./index.module.css"


export default function UserCoursesArea() {

    const [user, _] = useContext(User)
    const [userCourses, setUserCourses] = useContext(Courses)
    const requestData = {
        url: "/api/me/courses",
        method: "GET",
    }

    useEffect(() => {
        async function getFirstCourses() {
            try {
                const response = await axios({
                    ...requestData,
                    params: {
                        length:0
                    }
                })
            
                if (response.data && response.data.courses instanceof Object) {
                    setUserCourses(
                        new Set([...courseListImagesToBlobURL(response.data.courses)
                            .map((course, _, array) => {
                                return {...course, key:userCourses.length + array.length + 1}
                            })
                        ])
                    )
                }

            } catch(error) {
                console.log("Error in user courses get", error)
            }
        }

        getFirstCourses()
    },[])

    if (user) {

        return (
            <main className={styles.Area}>
                <CourseCatalog 
                    filters={[]} 
                    subscribe={false} 
                    userArea={true}
                    requestData={requestData}
                    courseStateOrContext={[userCourses, setUserCourses]} 
                />
            </main>
        )

    }

    return <Navigate to="/"/>
}