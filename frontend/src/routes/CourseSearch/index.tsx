import styles from "./index.module.css"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { CourseType } from "../../types/CourseType"
import { courseListImagesToBlobURL, } from "../../utils/courseListModifiers"
import CourseCatalog from "../../components/CourseCatalog"
import axios from "axios"


export default function CourseSearch() {

    const {name} = useParams()
    const requestData = {
        url: "/api/courses/search",
        method: "GET",
    }
    const [cachedCourses, setCachedCourses] = useState<CourseType[]>([])

    useEffect(() => {
        async function getFirstCourses() {
            try {
                const response = await axios({
                    ...requestData,
                    params: {
                        name:name,
                        length:0
                    }
                })
                console.log(response.data)
            
                if (response.data && response.data.courses satisfies CourseType[]) {
                    setCachedCourses([...courseListImagesToBlobURL(response.data.courses)])
                }
            } catch(error) {
                console.log("Error in course search")
            }
        }

        getFirstCourses()
    },[])


    return (
    <>
        <main className={styles.CourseRoute}>
            <CourseCatalog 
                userArea={false} 
                requestData={requestData}
                courseStateOrContext={[cachedCourses, setCachedCourses]}
            />
        </main>
    </>
    )

}