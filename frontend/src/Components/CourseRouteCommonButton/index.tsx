import { HTMLAttributes } from "react"
import styles from "./index.module.css"

export default function CourseRouteCommonButton(
    params:React.DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
) {

    return <button className={styles.CommonCourseButton} {...params}>{params.children}</button>

}