import styles from "./index.module.css"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import CourseCatalog from "../../components/CourseCatalog"
import { User } from "../../contexts/mainContexts"
import { courseListImagesToBlobURL } from "../../utils/courseListModifiers"
import Historia from "../../assets/historia.png"


export default function CourseSearch() {

    const [user, setUser] = useContext(User)
    const {name} = useParams()
    const requestData = {
        url: "/api/courses/search",
        method: "GET",
    }
    const [cachedCourses, setCachedCourses] = useState(new Set([]))

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
            
                if (response.data && response.data.courses instanceof Object) {
                    setCachedCourses(
                        new Set([...courseListImagesToBlobURL(response.data.courses)
                            .map((course, _, array) => {
                                return {...course, key:currentCourses.length + array.length + 1}
                            })
                        ])
                    )
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
                filters={[["name", name]]} 
                subscribe={true} 
                userArea={false} 
                requestData={requestData}
                courseStateOrContext={[cachedCourses, setCachedCourses]}
            />
        </main>
    </>
    )

}