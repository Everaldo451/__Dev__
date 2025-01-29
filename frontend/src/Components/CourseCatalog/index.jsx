import { useState, useEffect } from "react"
import { CourseFiltersContext } from "../../contexts/CourseFilters"
import PageChangeButton from "../courseComponents/PageChangeButton"
import CourseHeader from "./Header"
import Course from "../courseComponents/Course"
import { courseListLength } from "../../CourseListLength"
import { getState, setState } from "./coursesInCacheFunctions"
import FilterContainer from "../courseComponents/Filter"
import styles from "./index.module.css"

export default function CourseCatalog({initialfilters, userArea, courseStateOrContext, repeatFunction}){

    const [currentCourses, setCurrentCourses] = useState([])
    const [coursesInCache, setCoursesInCache] = courseStateOrContext
    const [unFilteredCourses, setUnFilteredCourses] = useState(new Set(coursesInCache))
    const [page, setPage] = useState(1)

    const [hidden, setHidden] = useState(true)
    const [language, setLanguage] = useState(null)
    const [filters, setFilters] = useState({
        "language": {
            "state": language,
            "setter": setLanguage
        },
        ...initialfilters
    })

    const getLocalCourses = () => getState(unFilteredCourses)
    const setLocalCourses = (courses) => setState(courses, unFilteredCourses, setUnFilteredCourses)

    function getFiltersQueryString(courses) {
        let filtersQueryString = `?length=${courses.length}`

        for (const [key, value] of Object.entries(filters)) {

            if (value instanceof Object && value.state && value.setter) {
                value.state!=null?
                    filtersQueryString += `${key}=${String(value.state)}&`
                    :null
            } else {
                value!=null?
                    filtersQueryString += `${key}=${String(value)}&`
                    :null
            }
        }
    }

    function filterModified(key) {

        const filterValue = filters[key]
        const localCourses = getLocalCourses()

        let courses = null
        if (filterValue instanceof Object && filterValue.setter) {
            courses=filterValue.state!=null?
                localCourses.filter(course => course[key] == filterValue.state)
                :localCourses
        } else {
            courses = filterValue!=null?
                localCourses.filter(course => course[key] == filterValue)
                :localCourses
        }

        setCurrentCourses(courses)

        if (courses.length != 0 && courses.length%courseListLength == 0) {return}
        repeatFunction(getFiltersQueryString(courses), [courses, setCurrentCourses])
    }
    
    useEffect(() => {
        filterModified("language")
    },[filters.language[0], initialfilters])

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
            <CourseHeader setHidden={setHidden}/>
            <CourseFiltersContext.Provider value={[filters, setFilters]}>

                <div className={styles.container}>
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
                </div>
                <FilterContainer setHidden={setHidden} hidden={hidden}/>

            </CourseFiltersContext.Provider>
            <section className={styles.PageButtons}>
                <PageChangeButton setPage={setPage} reduce={true}>{page-1}</PageChangeButton>
                <span>{page}</span>
                <PageChangeButton setPage={setPage}>{page+1}</PageChangeButton>
            </section>
        </>
    )
}