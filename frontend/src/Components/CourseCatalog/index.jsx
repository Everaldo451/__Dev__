import { useState, useEffect, useContext } from "react"
import { User } from "../../MainContexts"
import Course from "./Course"
import AddCourse from "./AddCourse"
import LanguageSelector from "./LanguageSelector"
import styles from "./index.module.css"
import { courseListLength } from "../../CourseListLength"

export default function CourseCatalog({params, subscribe, area, repeatFunction}){

    const [language, setLanguage] = useState(null)
    const [currentCourses, setCurrentCourses] = useState([])
    const [currentTimes, setCurrentTimes] = useState(1)
    const [user, setUser] = useContext(User)

    useEffect(() => {
        console.log("language Changed:")
        const courses = language!=null?currentCourses.filter(course => course.language == language):currentCourses
        setCurrentCourses(courses)
        const times = Math.ceil(courses.length/courseListLength)
        setCurrentTimes(times)
        console.log("time changed")
        console.log("changing")

        if (currentCourses.length != 0 && currentCourses.length%courseListLength == 0) {return}

        const parameters = `times=${times+1}${language!=null?"&lang="+language:""}&` + params
        console.log(parameters)
        repeatFunction(parameters, [currentCourses, setCurrentCourses])
    },[language, params])

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
                <LanguageSelector setLanguage={setLanguage}/>
            </div>
            <section className={styles.courses}>

                {currentCourses.map(course => 
                    <Course course={course} key={course.key} subscribe={subscribe}/>
                )}

            </section>
        </>
    )

}