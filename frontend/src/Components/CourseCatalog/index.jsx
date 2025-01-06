import { useState, useEffect, useContext } from "react"
import { User } from "../../MainContexts"
import Course from "./Course"
import AddCourse from "./AddCourse"
import LanguageSelector from "./LanguageSelector"
import styles from "./index.module.css"
import { courseListLength } from "../../CourseListLength"
import { getState, setState } from "./coursesInCacheFunctions"
import CourseListLoader from "../../CourseListLoader"

export default function CourseCatalog({filters, subscribe, area, courseStateOrContext, repeatFunction}){

    const [language, setLanguage] = useState(null)
    const [currentCourses, setCurrentCourses] = useState([])
    const [coursesInState, setCoursesInState] = courseStateOrContext
    const [toCacheCourses, setToCacheCourses] = useState(new Set(coursesInState))
    const [user, setUser] = useContext(User)

    const getCoursesInCache = () => getState(toCacheCourses)
    const setCoursesInCache = (courses) => setState(courses, toCacheCourses, setToCacheCourses)
    
    function languageModified() {
        console.log("language Changed:")
        const coursesInCache = getCoursesInCache()
        console.log(coursesInCache)

        const courses = language!=null?
            coursesInCache.filter(course => course.language == language)
            :coursesInCache
        setCurrentCourses(courses)

        if (courses.length != 0 && courses.length%courseListLength == 0) {return}

        const filtersList = [["length", courses.length],...filters]
        language?filtersList.push(["lang", language]):null

        filtersList.forEach((value, index) => {
            const joined = value.join("=")
            filtersList[index] = joined
        })
        const stringfiedFilters = "?"+filtersList.join("&")
        repeatFunction(stringfiedFilters, [courses, setCurrentCourses])
    }

    useEffect(() => {
        languageModified()
    },[language, filters])

    useEffect(() => {
        if (language == null && currentCourses.length > 0) {
            setCoursesInCache(currentCourses)
        }
    },[currentCourses])

    useEffect(() => {

        return () => {
            setCoursesInState(toCacheCourses)
        }
    },[])

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