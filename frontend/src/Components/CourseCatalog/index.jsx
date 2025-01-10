import { useState, useEffect, useContext } from "react"
import { User } from "../../MainContexts"
import Course from "./Course"
import AddCourse from "./AddCourse"
import LanguageSelector from "./LanguageSelector"
import styles from "./index.module.css"
import { courseListLength } from "../../CourseListLength"
import { getState, setState } from "./coursesInCacheFunctions"

export default function CourseCatalog({filters, subscribe, area, courseStateOrContext, repeatFunction}){

    const [language, setLanguage] = useState(null)
    const [currentCourses, setCurrentCourses] = useState([])
    const [coursesInState, setCoursesInState] = courseStateOrContext
    const [toCacheCourses, setToCacheCourses] = useState(new Set(coursesInState))
    const [user, setUser] = useContext(User)
    const [page, setPage] = useState(1)

    const getCoursesInCache = () => getState(toCacheCourses)
    const setCoursesInCache = (courses) => setState(courses, toCacheCourses, setToCacheCourses)

    function getFilters(courses) {
        const filtersList = [["length", courses.length],...filters]
        language?filtersList.push(["lang", language]):null

        filtersList.forEach((value, index) => {
            const joined = value.join("=")
            filtersList[index] = joined
        })
        const stringfiedFilters = "?"+filtersList.join("&")

        return stringfiedFilters
    }
    
    function languageModified() {
        console.log("language Changed:")
        const coursesInCache = getCoursesInCache()
        console.log(coursesInCache)

        const courses = language!=null?
            coursesInCache.filter(course => course.language == language)
            :coursesInCache
        setCurrentCourses(courses)

        if (courses.length != 0 && courses.length%courseListLength == 0) {return}

        repeatFunction(getFilters(courses), [courses, setCurrentCourses])
    }

    useEffect(() => {
        languageModified()
    },[language, filters])

    useEffect(() => {
        if (language == null && currentCourses.length > 0) {
            console.log(currentCourses.length, currentCourses, page)
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

                {currentCourses.filter((value, index, array) => 
                        index >= 6*(page-1) && page*6 >= index
                    ).map(course => 
                    <Course course={course} key={course.key} subscribe={subscribe}/>
                )}

            </section>
            <section className={styles.PageButtons}>
                <button>Prev</button>
                <span>{page}</span>
                <button>Next</button>
            </section>
        </>
    )

}