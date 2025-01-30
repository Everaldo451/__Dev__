import styles from "./index.module.css"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import CourseCatalog from "../../Components/CourseCatalog"
import { User } from "../../MainContexts"
import { courseListImagesToBlobURL } from "../../utils/courseListModifiers"
import Historia from "../../assets/historia.png"


export default function CourseSearch() {

    const [user, setUser] = useContext(User)
    const {name} = useParams()
    const requestData = {
        url: "/api/courses/search",
        method: "GET",
    }
    
    const [cachedCourses, setCachedCourses] = useState(new Set([
        {
            id:1,
            language: "Python",
            name: "Ensinando Python",
            teachers:"Professor Everaldo",
            image: Historia,
            price: 50
        },
        {
            id:1,
            language: "Python",
            name: "Ensinando Python",
            teachers:"Professor Everaldo",
            image: Historia,
            price: 50
        },
        {
            id:1,
            language: "Python",
            name: "Ensinando Python",
            teachers:"Professor Everaldo",
            image: Historia,
            price: 50
        },
        {
            id:1,
            language: "Python",
            name: "Ensinando Python",
            teachers:"Professor Everaldo",
            image: Historia,
            price: 50
        },
        {
            id:1,
            language: "Python",
            name: "Ensinando Python",
            teachers:"Professor Everaldo",
            image: Historia,
            price: 50
        },
        {
            id:1,
            language: "Python",
            name: "Ensinando Python",
            teachers:"Professor Everaldo",
            image: Historia,
            price: 50
        }
    ]))

    useEffect(() => {
        async function getFirstCourses() {
            try {
                const response = await axios({
                    ...requestData,
                    data: {
                        name:name,
                        length:0
                    }
                })
            
                if (response.data && response.data.courses instanceof Object) {
                    setCachedCourses(
                        {...courseListImagesToBlobURL(response.data.courses)
                            .map((course, _, array) => {
                                return {...course, key:currentCourses.length + array.length + 1}
                            })
                        }
                    )
                }
            } catch(error) {
                console.log("Error in course search")
            }
        }

        getFirstCourses()
    })


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