import { useState, useEffect, useContext } from "react"
import { User } from "../../MainContexts"
import styles from "./index.module.css"
import Course from "./Course"
import AddCourse from "./AddCourse"
import LanguageSelector from "./LanguageSelector"

export default function CourseCatalog({courses, subscribe, area}){

    const [language, setLanguage] = useState(null)
    const [currentCourses, setCurrentCourses] = useState(courses)
    const [user, setUser] = useContext(User)

    useEffect(() => {
        setCurrentCourses(language!=null?courses.filter(course => course.language == language):courses)
    },[language,courses])

    return (
        <>
            {area == true && user.user_type == "teacher"?
                <AddCourse/>
                :null
            }
            <div className={styles.resultsLanguage}>
                {area == true?
                    <h2 style={{color:"white"}}>Meus Cursos:</h2>
                    :
                    <h2 style={{color:"white"}}>Cursos:</h2>
                }
                <LanguageSelector setLanguage={setLanguage}>
                    <option selected value="">None</option>
                    <option value="Python">Python</option>
                    <option value="JavaScript">JavaScript</option>
                </LanguageSelector>
            </div>
            <section className={styles.courses}>

                {currentCourses.map(course => 
                    <Course course={course} key={course.key} subscribe={subscribe}/>
                )}

            </section>
        </>
    )

}