import AnimatedImage from "../../courseComponents/Filter/AnimatedImage"
import styles from "./index.module.css"

export default function CourseHeader({setHidden}) {
    return (
        <div className={styles.courseHeader}>
            <h2>Courses</h2>
            <button className={styles.Button} onClick={(e) => {setHidden(false)}}>
                <AnimatedImage/>
            </button>
        </div>
    )
}