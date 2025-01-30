import { useEffect, useState } from "react"
import { setState } from "../../CourseCatalog/coursesInCacheFunctions"
import NameField from "./NameField"
import PriceField from "./PriceField"
import SubmitInput from "./SubmitInput"
import styles from "./index.module.css"

export function Filter(
    {
        slideIn, 
        initialfilters, 
        unFilteredCoursesState, 
        currentCoursesState,
        requestData,
    }
) {

    const [currentCourses, setCurrentCourses] = currentCoursesState
    const [unFilteredCourses, setUnFilteredCourses] = unFilteredCoursesState

    const [language, setLanguage] = useState(null)

    const setLocalCourses = (courses) => setState(courses, unFilteredCourses, setUnFilteredCourses)

    useEffect(() => {
        if (language == null && currentCourses.length > 0) {
            console.log(currentCourses.length, currentCourses)
            setLocalCourses(currentCourses)
        }
    },[currentCourses])

    return (
        <section className={`${styles.filter} ${slideIn?styles.filterIn:styles.filterOut}`}>
            <form>
                <NameField/>
                <PriceField/>
                <SubmitInput 
                    unFilteredCourses={unFilteredCourses}
                    currentCourses={currentCourses}
                    setCurrentCourses={setCurrentCourses}
                    requestData={requestData}
                />
            </form>
        </section>
    )
}

export function DarkMask({setHidden, slideIn, setSlideIn}) {
    return(
        <div 
            className={`${styles.darkMask} ${slideIn?styles.darkMaskIn:styles.darkMaskOut}`} 
            onClick={(e)=>{setSlideIn(false)}}
            onAnimationEnd={(e) => {!slideIn?setHidden(true):null}}
        />
    )
}