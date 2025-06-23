import { useEffect, useState } from "react"
import styles from "./index.module.css"

export interface SlideSectionProps {
    slideIn: boolean,
    children: React.ReactNode,
    classNames?: string[]
}

export default function SlideSection({slideIn, children, classNames}:SlideSectionProps) {

    const [style, setStyle] = useState("")

    useEffect(() => {
        setStyle(slideIn?styles.active:styles.deactive)
    },[slideIn])

    return (
        <section
            className={
                `${styles.sec} ${classNames?.join(" ")} ${style}`
            }
        >
            {children}
        </section>
    )

}