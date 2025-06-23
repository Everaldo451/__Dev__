export interface RequestData {
    url:string,
    method:string
}


import { useState, useEffect } from "react"
import PageChangeButton from "./PageChangeButton"
import CatalogHeader from "./CatalogHeader"
import { CourseContextType } from "../../contexts/CourseContext"

import Course from "../course-components/Course"
import DarkMask from "../DarkMask"
import Filter from "../course-components/Filter"

import { CourseHashMap, courseArrayToHashMap, courseHashMapToArray } from "./courseInCacheFunctions"
import { courseListSortByDateTime } from "../../utils/courseListModifiers"

import { CourseType } from "../../types/CourseType"
import styles from "./index.module.css"


interface CourseCatalogProps {
    userArea:boolean,
    courseStateOrContext:CourseContextType,
    requestData: RequestData
}

export default function CourseCatalog(
    {userArea, courseStateOrContext, requestData}:CourseCatalogProps
){

    const [coursesInCache, setCoursesInCache] = courseStateOrContext
    const [currentCourses, setCurrentCourses] = useState<CourseType[]>([])
    const [loadedCoursesHashMap, setLoadedCoursesHashMap] = useState<CourseHashMap>({})
    const [page, setPage] = useState(1)

    const [hidden, setHidden] = useState(true)
    const [slideIn, setSlideIn] = useState(!hidden)

    useEffect(() => {
        setSlideIn(!hidden)
    },[hidden])

    useEffect(() => {
        return () => {
            const coursesArray = courseHashMapToArray(loadedCoursesHashMap)
            courseListSortByDateTime(coursesArray)
            setCoursesInCache(coursesArray)
        }
    },[])

    useEffect(() => {
        console.log(currentCourses)
    },[currentCourses])

    useEffect(()=>{
        console.log(coursesInCache)
        setCurrentCourses(coursesInCache)
        setLoadedCoursesHashMap(courseArrayToHashMap(coursesInCache))
    },[coursesInCache])

    return (
        <>
            <CatalogHeader 
                setHidden={setHidden} 
                setCurrentCourses={setCurrentCourses}
                setLoadedCoursesHashMap={setLoadedCoursesHashMap}
            />

            {!hidden?<DarkMask setHidden={setHidden} slideIn={slideIn} setSlideIn={setSlideIn}/>:null}
            <Filter 
                slideIn={slideIn} 
                loadedCoursesHashMapState={[loadedCoursesHashMap, setLoadedCoursesHashMap]} 
                currentCoursesState={[currentCourses, setCurrentCourses]}
                requestData={requestData}
                page={page}
            />

            <div className={styles.container}>
                <section className={styles.courses}>

                    {currentCourses
                        .filter((_, index) => index >= 6*(page-1) && page*6 > index)
                        .map(course =>
                            <Course 
                                course={course} 
                                key={course.id} 
                                subscribe={!userArea} 
                            />)
                    }

                </section>
            </div>

            <section className={styles.PageButtons}>
                <PageChangeButton setPage={setPage} reduce={true}>{page-1}</PageChangeButton>
                <span>{page}</span>
                <PageChangeButton setPage={setPage} reduce={false}>{page+1}</PageChangeButton>
            </section>
        </>
    )
}