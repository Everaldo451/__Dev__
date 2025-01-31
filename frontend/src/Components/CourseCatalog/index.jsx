import { useState, useEffect } from "react"
import PageChangeButton from "../courseComponents/PageChangeButton"
import CourseHeader from "../courseComponents/CatalogHeader"
import Course from "../courseComponents/Course"
import {DarkMask, Filter} from "../courseComponents/Filter"
import styles from "./index.module.css"

export default function CourseCatalog({initialfilters, userArea, courseStateOrContext, requestData}){

    const [coursesInCache, setCoursesInCache] = courseStateOrContext
    const [currentCourses, setCurrentCourses] = useState([])
    const [unFilteredCourses, setUnFilteredCourses] = useState(new Set(coursesInCache))
    const [page, setPage] = useState(1)

    const [hidden, setHidden] = useState(true)
    const [slideIn, setSlideIn] = useState(!hidden)

    useEffect(() => {
        setSlideIn(!hidden)
    },[hidden])

    useEffect(() => {
        return () => {
            console.log(unFilteredCourses)
            setCoursesInCache(unFilteredCourses)
        }
    },[])

    useEffect(()=>{
       setCurrentCourses([...coursesInCache])
    },[coursesInCache])

    return (
        <>
            <CourseHeader setHidden={setHidden} setCurrentCourses={setCurrentCourses}/>

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
                                key={course.key} 
                                subscribe={!userArea} 
                                setCurrentCourses={setCurrentCourses}
                            />)
                    }

                </section>
            </div>

            <section className={styles.PageButtons}>
                <PageChangeButton setPage={setPage} reduce={true}>{page-1}</PageChangeButton>
                <span>{page}</span>
                <PageChangeButton setPage={setPage}>{page+1}</PageChangeButton>
            </section>
        </>
    )
}