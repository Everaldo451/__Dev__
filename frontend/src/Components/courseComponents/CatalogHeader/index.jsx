import { useContext } from "react"
import { User } from "../../../MainContexts"
import AnimatedImage from "./AnimatedImage"
import AddCourse from "../AddCourse"
import styles from "./index.module.css"

export default function CourseHeader({setHidden, setCurrentCourses}) {

    const [user, _] = useContext(User)

    return (
        <div className={styles.courseHeader}>
            <h2>Courses</h2>
            {user && user.user_type == "teacher"?
                <AddCourse setCourses={setCurrentCourses}/>
                :null
            }
            <button className={styles.Button} onClick={(e) => {setHidden(false)}}>
                <AnimatedImage/>
            </button>
        </div>
    )
}