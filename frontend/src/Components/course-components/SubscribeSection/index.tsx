import { SetStateAction } from "react";
import { CourseType } from "../../../types/CourseType";
import SubscribeButton from "../SubscribeButton";
import styles from "./index.module.css"

interface SubscribeSectionProps {
    course: CourseType,
    slideIn: boolean
    setSlideIn: React.Dispatch<SetStateAction<boolean>>,
    children: React.ReactNode
}

export default function SubscribeSection({course, slideIn, setSlideIn, children}:SubscribeSectionProps) {

    return (
        <section className={`${styles.subscribe} ${slideIn?styles.slideIn:styles.slideOut}`}>
            <h3>Do you want subscribe?</h3>
            <div className={styles.buttonContainer}>
                {children}
            </div>
        </section>
    )

}