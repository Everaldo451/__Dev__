import { useState, useEffect, useContext } from "react"
import { User } from "../../MainContexts"
import Course from "../courseComponents/Course"
import AddCourse from "../courseComponents/AddCourseButton"
import LanguageSelector from "../courseComponents/LanguageSelector"
import styles from "./index.module.css"
import { courseListLength } from "../../CourseListLength"
import { getState, setState } from "./coursesInCacheFunctions"
import PageChangeButton from "../courseComponents/PageChangeButton"

export default function CourseCatalog({filters, userArea, courseStateOrContext, repeatFunction}){

    const [language, setLanguage] = useState(null)
    const [currentCourses, setCurrentCourses] = useState([])
    const [coursesInCache, setCoursesInCache] = courseStateOrContext
    const [unFilteredCourses, setUnFilteredCourses] = useState(new Set(coursesInCache))
    const [user, setUser] = useContext(User)
    const [page, setPage] = useState(1)

    const getLocalCourses = () => getState(unFilteredCourses)
    const setLocalCourses = (courses) => setState(courses, unFilteredCourses, setUnFilteredCourses)

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
        const localCourses = getLocalCourses()
        console.log(localCourses)

        const courses = language!=null?
            localCourses.filter(course => course.language == language)
            :localCourses
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
            setLocalCourses(currentCourses)
        }
    },[currentCourses])

    useEffect(() => {
        return () => {
            console.log(unFilteredCourses)
            setCoursesInCache(unFilteredCourses)
        }
    },[])

    return (
        <>
            {userArea == true && user.user_type == "teacher"?
                <AddCourse setCourses={setCurrentCourses}/>
                :null
            }
            <div className={styles.resultsLanguage}>
                {userArea == true?
                    <h2 style={{color:"white"}}>Meus Cursos:</h2>
                    :
                    <h2 style={{color:"white"}}>Cursos:</h2>
                }
                <LanguageSelector setLanguage={setLanguage}/>
            </div>
            <section className={styles.courses}>

                {currentCourses
                    .filter((_, index) => index >= 6*(page-1) && page*6 >= index)
                    .map(course =>
                        <Course 
                            course={course} 
                            key={course.key} 
                            subscribe={!userArea} 
                            setCurrentCourses={setCurrentCourses}
                        />)
                }

            </section>
            <section className={styles.PageButtons}>
                <PageChangeButton setPage={setPage} reduce={true}>Prev</PageChangeButton>
                <span>{page}</span>
                <PageChangeButton setPage={setPage}>Next</PageChangeButton>
            </section>
        </>
    )

}