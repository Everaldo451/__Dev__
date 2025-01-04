import { useState, useContext } from "react"
import { User, CSRFContext, Courses } from "../../../MainContexts"
import CourseRouteCommonButton from "../../CourseRouteCommonButton"
import axios from "axios"
import styles from "./index.module.css"
import { useNavigate } from "react-router-dom"


export default function Course({course, subscribe}) {

    const [hover,setHover] = useState(false)
    const [csrf_token, setCSRFToken] = useContext(CSRFContext)
    const [user, setUser] = useContext(User)
    const [courses, setCourses] = useContext(Courses)
    const navigate = useNavigate()

    console.log("courseAdded")

    async function Subscribe() {

        let route = subscribe==true?"subscribe":"unsubscribe"

        try{

            const response = await axios.post(`/api/courses/${route}/${course.id}`,undefined,
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken':`${csrf_token}`
                    }
                }
            )

            if (response.status == 200) {
                if (subscribe) {
                    setCourses(prev => [course, ...prev])
                } else {
                    setCourses(prev => [...prev.filter((value) => value.id != course.id)])
                }
                navigate("/")
            }

        } catch(error) {
            console.log(error)
        }
    }

    return (
        <section 
            className={styles.Course} 
            onMouseEnter={(e) => {setHover(!hover)}} 
            onMouseLeave={(e) => {setHover(!hover)}}
        >
            <div className={styles.imageContainer}>
                <img src={course.image} width={100}></img>
            </div>
            <p style={{textAlign:"center"}}>{course.name}</p>
            <p className={styles.data}>
                <span>Language: </span>
                <span style={{textDecoration:"underline", color:"inherit"}}>{course.language}</span>
            </p>
            <p className={styles.data}>
                <span>Professores: </span>
                {course.teachers}
            </p>
            <p className={styles.data}>
                <span>Alunos: </span>
                {course.student_count}
            </p>
            <p className={styles.data} style={{marginTop:10}}>
                <span>Descrição: </span>
            </p>
            <p className={styles.data}>{course.description}</p>
            {hover == true?
                <div style={{display:"flex",justifyContent:"center"}}>
                    {subscribe?
                        !user?
                            <CourseRouteCommonButton onClick={(e) => {e.preventDefault();navigate("/login")}}>
                                Se inscrever
                            </CourseRouteCommonButton>
                            :user.user_type == "student"?
                                <CourseRouteCommonButton onClick={(e) => {e.preventDefault();Subscribe()}}>
                                    Se inscrever
                                </CourseRouteCommonButton>
                                :null
                        :null
                    }
                    {!subscribe?
                        <CourseRouteCommonButton>
                            Acessar curso
                        </CourseRouteCommonButton>
                        :null
                    }
                </div>
                :null
            }
        </section>
    )

}