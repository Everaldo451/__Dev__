import styles from "./index.module.css"

export default function CourseRouteCommonButton(params) {

    return <button className={styles.CommonCourseButton} {...params}>{params.children}</button>

}