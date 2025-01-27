import { useState, useContext } from "react"
import { User, Courses } from "../../../MainContexts"
import CourseRouteCommonButton from "../../CourseRouteCommonButton"
import SubscribeButton from "../SubscribeButton"
import UnSubscribeButton from "../UnSubscribeButton"
import styles from "./index.module.css"


export default function Course({course, subscribe, setCurrentCourses}) {

    const [hover,setHover] = useState(false)
    const [user,_] = useContext(User)

    return (
        <section 
            className={styles.Course} 
            onMouseEnter={(e) => {setHover(!hover)}} 
            onMouseLeave={(e) => {setHover(!hover)}}
        >
            {!subscribe && user?
                <UnSubscribeButton course={course} setCourses={setCurrentCourses}/>:null
            }
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
                        <SubscribeButton course={course}>
                            Se inscrever
                        </SubscribeButton>
                        :
                        <CourseRouteCommonButton>
                            Acessar curso
                        </CourseRouteCommonButton>
                    }
                </div>
                :null
            }
        </section>
    )

}