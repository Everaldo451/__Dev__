import { useState, useEffect, useContext } from "react"
import { User } from "../../MainContexts"
import Course from "./Course"
import AddCourse from "./AddCourse"
import LanguageSelector from "./LanguageSelector"
import styles from "./index.module.css"
import { courseListLength } from "../../CourseListLength"
import { getFnIfCache, setFnIfCache, getFnIfState, setFnIfState } from "./coursesInCacheFunctions"

export default function CourseCatalog({filters, subscribe, area, storeInSession=false, repeatFunction}){

    const [language, setLanguage] = useState(null)
    const [currentCourses, setCurrentCourses] = useState([])
    const [coursesInState, setCoursesInState] = useState(storeInSession?null:new Set([]))
    const [user, setUser] = useContext(User)

    let getCoursesInCache;
    let setCoursesInCache;

    if (storeInSession === true) {
        getCoursesInCache = getFnIfCache
        setCoursesInCache = setFnIfCache
    } else if (storeInSession === false) {
        getCoursesInCache = () => getFnIfState(coursesInState)
        setCoursesInCache = (courses) => setFnIfState(courses, coursesInState, setCoursesInState)
    }

    function languageModified() {
        console.log("language Changed:")

        const coursesInCache = getCoursesInCache()
        console.log(coursesInCache)

        const courses = language!=null?
            coursesInCache.filter(course => course.language == language)
            :
            coursesInCache

        setCurrentCourses(courses)

        if (courses.length != 0 && courses.length%courseListLength == 0) {return}

        const parameters = [
            ["length", courses.length],
            ...filters
        ]
        language?parameters.push(["lang", language]):null

        parameters.forEach((value, index) => {
            const joined =  value.join("=")
            parameters[index] = joined
        })

        const stringParameters = "?"+parameters.join("&")

        repeatFunction(stringParameters, [courses, setCurrentCourses])
    }

    useEffect(() => {
        setCoursesInCache([])
    },[])

    useEffect(() => {
        languageModified()
    },[language, filters])

    useEffect(() => {
        if (language == null && currentCourses.length > 0) {
            console.log(currentCourses, language)
            setCoursesInCache(currentCourses)
        }
    },[currentCourses])

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