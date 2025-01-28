import Filter from "../../courseComponents/Filter"
import styles from "./index.module.css"

export default function CourseHeader() {
    return (
        <div className={styles.courseHeader}>
            <h2>Courses</h2>
            <Filter/>
        </div>
    )
}