import { useState, useContext, SetStateAction, useEffect } from "react"
import { CourseType } from "../../../types/CourseType"

import SubscribeButton from "../SubscribeButton"
import UnSubscribeButton from "../UnSubscribeButton"
import SubscribeSection from "../SubscribeSection"

import DarkMask from "../../DarkMask"
import Image from "../Image"
import styles from "./index.module.css"

interface CourseProps {
    course: CourseType,
    subscribe: boolean,
    setCurrentCourses: React.Dispatch<SetStateAction<CourseType[]>>
}


export default function Course({course, subscribe, setCurrentCourses}:CourseProps) {

    const [hidden, setHidden] = useState(true)
    const [slideIn, setSlideIn] = useState(false)

    function onClick(e:React.MouseEvent<HTMLElement>){
        setHidden(false)
    }

    useEffect(() => {
        setSlideIn(!hidden)
    },[hidden])

    return (
        <>
            {!hidden?
            <>
                <DarkMask setHidden={setHidden} setSlideIn={setSlideIn} slideIn={slideIn}/>
                <SubscribeSection setSlideIn={setSlideIn} course={course} slideIn={slideIn}>
                    {subscribe?
                        <SubscribeButton course={course}>Subscribe</SubscribeButton>
                        :<UnSubscribeButton course={course}>Unsubscribe</UnSubscribeButton>
                    }
                </SubscribeSection>
            </>
            :null}
            <section className={styles.course} onClick={onClick}>
                <Image src={course.image} className={styles.image}/>
                <section className={styles.data}>
                    <h4>{course.name}</h4>
                    <p className={styles.language}>Language: {course.language}</p>
                    <p className={styles.teachers}>{course.teachers}</p>
                    <p className={styles.price}>R$ {Number(course.price)}</p>
                </section>
            </section>
        </>
    )

}