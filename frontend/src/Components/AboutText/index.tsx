import { CurrentTextIndex } from "../AboutUsTextChanger";
import React, {useContext} from "react";
import styles from "./index.module.css"

interface AboutTextProps {
    children: React.ReactNode,
    title: string,
    index: number
}

export default function AboutText({children, title, index}:AboutTextProps) {

    const [textIndex, _] = useContext(CurrentTextIndex)

    return (
        <>
            {index===textIndex?
                <section className={styles.aboutText}>
                    <h3 className={styles.title}>{title}</h3>
                    {children}
                </section>
                :null
            }
        </>
    )
}