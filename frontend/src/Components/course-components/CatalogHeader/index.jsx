import { useState, useContext, useEffect } from "react"
import { User } from "../../../contexts/mainContexts"
import AnimatedImage from "./AnimatedImage"
import AddCourse from "../AddCourse"
import { DarkMask } from "../../DarkMask"
import styles from "./index.module.css"

export default function CourseHeader({setHidden, setCurrentCourses}) {

    const [user, _] = useContext(User)
    const [componentHidden, setComponentHidden] = useState(true)
    const [slideIn, setSlideIn] = useState(true)
    
    useEffect(() => {
        setSlideIn(!componentHidden)
    },[componentHidden])

    return (
        <div className={styles.courseHeader}>
            <h2>Courses</h2>
            {user && user.user_type == "teacher"?
                <>
                    <AddCourse 
                        setCourses={setCurrentCourses} 
                        hiddenState={[componentHidden, setComponentHidden]}
                        slideIn={slideIn}
                    />
                    {!componentHidden?
                        <DarkMask setHidden={setComponentHidden} slideIn={slideIn} setSlideIn={setSlideIn}/>
                        :null
                    }
                </>
                :null
            }
            <button className={styles.Button} onClick={(e) => {setHidden(false)}}>
                <AnimatedImage/>
            </button>
        </div>
    )
}