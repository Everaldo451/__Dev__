import { useEffect, useState, useRef } from "react"
import { setState } from "../../CourseCatalog/courseInCacheFunctions"
import NameField from "./NameField"
import PriceField from "./PriceField"
import LanguageField from "./LanguageField"
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
    const [filterSwitchs, setFilterSwitchs] = useState({})
    const formRef=useRef(null)

    const setLocalCourses = (courses) => setState(courses, setUnFilteredCourses)

    useEffect(() => {
        const formData=new FormData(formRef.current)

        let isNotFiltered=true
        for (const [filterName, filterData] of Object.entries(filterSwitchs)) {
            const inputValue=formData.get(filterName)
            if (inputValue===filterData.defaultValue) {
                continue
            }
            isNotFiltered=false
            break
        }
        isNotFiltered?setLocalCourses(currentCourses):null
    },[currentCourses])


    return (
        <section className={`${styles.filter} ${slideIn?styles.filterIn:styles.filterOut}`}>
            <form ref={formRef} className={styles.form}>
                <NameField setFilterSwitchs={setFilterSwitchs}/>
                <PriceField setFilterSwitchs={setFilterSwitchs}/>
                <LanguageField setFilterSwitchs={setFilterSwitchs}/>
                <SubmitInput 
                    unFilteredCourses={unFilteredCourses}
                    currentCourses={currentCourses}
                    setCurrentCourses={setCurrentCourses}
                    requestData={requestData}
                    filterSwitchs={filterSwitchs}
                />
            </form>
        </section>
    )
}