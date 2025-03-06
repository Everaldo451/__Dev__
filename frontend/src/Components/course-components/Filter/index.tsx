import { useState, useRef, SetStateAction } from "react"
import { CourseType } from "../../../types/CourseType"
import { CourseHashMap } from "../../CourseCatalog/courseInCacheFunctions"
import { RequestData } from "../../CourseCatalog"
import NameField from "./NameField"
import PriceField from "./PriceField"
import LanguageField from "./LanguageField"
import SubmitInput from "./SubmitInput"
import styles from "./index.module.css"

export interface FilterProps {
    slideIn: boolean,
    //initialfilters: [],
    loadedCoursesHashMapState: [CourseHashMap, React.Dispatch<SetStateAction<CourseHashMap>>],
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
        loadedCoursesHashMapState, 
        currentCoursesState,
        requestData,
    }:FilterProps
) {

    const [currentCourses, setCurrentCourses] = currentCoursesState
    const [loadedCoursesHashMap, setLoadedCoursesHashMap] = loadedCoursesHashMapState
    const [filterSwitchs, setFilterSwitchs] = useState<{[key:string]:FilterType}>({})
    const formRef=useRef<HTMLFormElement>(null)

    return (
        <section className={`${styles.filter} ${slideIn?styles.active:""}`}>
            <form ref={formRef} className={styles.form}>
                <NameField setFilterSwitchs={setFilterSwitchs}/>
                <PriceField setFilterSwitchs={setFilterSwitchs}/>
                <LanguageField setFilterSwitchs={setFilterSwitchs}/>
                <SubmitInput 
                    loadedCoursesHashMapState={[loadedCoursesHashMap, setLoadedCoursesHashMap]}
                    currentCourses={currentCourses}
                    setCurrentCourses={setCurrentCourses}
                    requestData={requestData}
                    filterSwitchs={filterSwitchs}
                />
            </form>
        </section>
    )
}