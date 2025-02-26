import axios from "axios";
import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { CourseContext } from "../../contexts/CourseContext";
import { CourseType } from "../../types/CourseType";
import CourseCatalog from "../../components/CourseCatalog";
import { courseListImagesToBlobURL } from "../../utils/courseListModifiers";
import styles from "./index.module.css"


export default function UserCoursesArea() {

    const [user, _] = useContext(UserContext)
    const [userCourses, setUserCourses] = useContext(CourseContext)
    const requestData = {
        url: "/api/me/courses/search",
        method: "GET",
    }

    useEffect(() => {
        async function getFirstCourses() {
            try {
                const response = await axios({
                    ...requestData,
                    params: {
                        length:userCourses.size
                    }
                })
            
                if (response.data && response.data.courses satisfies CourseType[]) {
                    setUserCourses(
                        new Set([...courseListImagesToBlobURL(response.data.courses)])
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
                    //initialfilters={[]} 
                    userArea={true}
                    requestData={requestData}
                    courseStateOrContext={[userCourses, setUserCourses]} 
                />
            </main>
        )

    }

    return <Navigate to="/"/>
}