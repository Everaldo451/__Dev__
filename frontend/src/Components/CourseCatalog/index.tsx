export interface RequestData {
    url:string,
    method:string
}


import { useState, useEffect } from "react"
import PageChangeButton from "../course-components/PageChangeButton"
import CatalogHeader from "../course-components/CatalogHeader"
import { CourseContextType } from "../../contexts/CourseContext"

import Course from "../course-components/Course"
import DarkMask from "../DarkMask"
import Filter from "../course-components/Filter"

import { CourseType } from "../../types/CourseType"
import styles from "./index.module.css"


interface CourseCatalogProps {
    initialfilters:[],
    userArea:boolean,
    courseStateOrContext:CourseContextType,
    requestData: RequestData
}

export default function CourseCatalog(
    {initialfilters, userArea, courseStateOrContext, requestData}:CourseCatalogProps
){

    const [coursesInCache, setCoursesInCache] = courseStateOrContext
    const [currentCourses, setCurrentCourses] = useState<CourseType[]>([])
    const [unFilteredCourses, setUnFilteredCourses] = useState<Set<CourseType>>(new Set())
    const [page, setPage] = useState(1)

    const [hidden, setHidden] = useState(true)
    const [slideIn, setSlideIn] = useState(!hidden)

    useEffect(() => {
        setSlideIn(!hidden)
    },[hidden])

    useEffect(() => {
        return () => {
            setCoursesInCache(unFilteredCourses)
        }
    },[])

    useEffect(() => {
        console.log(currentCourses)
    },[currentCourses])

    useEffect(()=>{
        console.log(coursesInCache)
        setCurrentCourses([...coursesInCache])
        setUnFilteredCourses(new Set(coursesInCache))
    },[coursesInCache])

    return (
        <>
            <CatalogHeader setHidden={setHidden} setCurrentCourses={setCurrentCourses}/>

            {!hidden?<DarkMask setHidden={setHidden} slideIn={slideIn} setSlideIn={setSlideIn}/>:null}
            <Filter 
                slideIn={slideIn} 
                initialfilters={initialfilters}
                unFilteredCoursesState={[unFilteredCourses, setUnFilteredCourses]} 
                currentCoursesState={[currentCourses, setCurrentCourses]}
                requestData={requestData}
            />

            <div className={styles.container}>
                <section className={styles.courses}>

                    {currentCourses
                        .filter((_, index) => index >= 6*(page-1) && page*6 >= index)
                        .map(course =>
                            <Course 
                                course={course} 
                                key={course.id} 
                                subscribe={!userArea} 
                                setCurrentCourses={setCurrentCourses}
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