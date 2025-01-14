import { useState, useEffect, useContext } from "react"
import { User } from "../../MainContexts"
import Course from "./Course"
import AddCourse from "./AddCourse"
import LanguageSelector from "./LanguageSelector"
import styles from "./index.module.css"
import { courseListLength } from "../../CourseListLength"
import { getState, setState } from "./coursesInCacheFunctions"
import PageChangeButton from "./PageChangeButton"

export default function CourseCatalog({filters, subscribe, area, courseStateOrContext, repeatFunction}){

    const [language, setLanguage] = useState(null)
    const [currentCourses, setCurrentCourses] = useState([])
    const [coursesInState, setCoursesInState] = courseStateOrContext
    const [unFilteredCourses, setUnFilteredCourses] = useState(new Set(coursesInState))
    const [user, setUser] = useContext(User)
    const [page, setPage] = useState(1)

    const getCoursesInCache = () => getState(unFilteredCourses)
    const setCoursesInCache = (courses) => setState(courses, unFilteredCourses, setUnFilteredCourses)

    function getFilters(courses) {
        const filtersList = [["length", courses.length],...filters]
        language?filtersList.push(["lang", language]):null

        filtersList.forEach((value, index) => {
            const joined = value.join("=")
            filtersList[index] = joined
        })
        return "?"+filtersList.join("&")
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
        return () => {setCoursesInState(unFilteredCourses)}
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

                {currentCourses.filter((value, index, array) => index >= 6*(page-1) && page*6 >= index
                    ).map(course => 
                    <Course course={course} key={course.key} subscribe={subscribe}/>
                )}

            </section>
            <section className={styles.PageButtons}>
                <PageChangeButton setPage={setPage} reduce={true}>Prev</PageChangeButton>
                <span>{page}</span>
                <PageChangeButton setPage={setPage}>Next</PageChangeButton>
            </section>
        </>
    )

}