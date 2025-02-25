import { useState, useContext, useEffect, SetStateAction } from "react"

import { UserContext } from "../../../contexts/UserContext"
import { CourseType } from "../../../types/CourseType"

import AnimatedImage from "./AnimatedImage"
import AddCourse from "../../course-components/AddCourse"
import DarkMask from "../../DarkMask"
import styles from "./index.module.css"

interface CatalogHeaderProps {
    setHidden: React.Dispatch<SetStateAction<boolean>>,
    setCurrentCourses: React.Dispatch<SetStateAction<CourseType[]>>
}

export default function CatalogHeader({setHidden, setCurrentCourses}:CatalogHeaderProps) {

    const [user, _] = useContext(UserContext)
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
            <button className={styles.Button} onClick={(_) => {setHidden(false)}}>
                <AnimatedImage/>
            </button>
        </div>
    )
}