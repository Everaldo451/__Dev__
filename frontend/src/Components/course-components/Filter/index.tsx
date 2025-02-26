import { useEffect, useState, useRef, SetStateAction } from "react"
import { setState } from "../../CourseCatalog/courseInCacheFunctions"
import { CourseType } from "../../../types/CourseType"
import { RequestData } from "../../CourseCatalog"
import NameField from "./NameField"
import PriceField from "./PriceField"
import LanguageField from "./LanguageField"
import SubmitInput from "./SubmitInput"
import styles from "./index.module.css"

export interface FilterProps {
    slideIn: boolean,
    //initialfilters: [],
    unFilteredCoursesState: [Set<CourseType>, React.Dispatch<SetStateAction<Set<CourseType>>>],
    currentCoursesState: [CourseType[], React.Dispatch<SetStateAction<CourseType[]>>],
    requestData: RequestData
}

export interface FilterType {
    defaultValue: any,
    function: (courseAttr:any, inputValue:FormDataEntryValue) => void
}

export default function Filter(
    {
        slideIn, 
        //initialfilters, 
        unFilteredCoursesState, 
        currentCoursesState,
        requestData,
    }:FilterProps
) {

    const [currentCourses, setCurrentCourses] = currentCoursesState
    const [unFilteredCourses, setUnFilteredCourses] = unFilteredCoursesState
    const [filterSwitchs, setFilterSwitchs] = useState<{[key:string]:FilterType}>({})
    const formRef=useRef<HTMLFormElement>(null)

    const setLocalCourses = (courses:CourseType[]) => setState(courses, setUnFilteredCourses)

    useEffect(() => {
        const formData=new FormData(formRef.current?formRef.current:undefined)

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
        <section className={`${styles.filter} ${slideIn?styles.active:""}`}>
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