import { CurrentTextIndex } from "../AboutUsTextChanger";
import React, {useContext} from "react";
import { useMediaQuery } from "react-responsive";
import styles from "./index.module.css"

interface AboutTextProps {
    children: React.ReactNode,
    title: string,
    index: number
}

export default function AboutText({children, title, index}:AboutTextProps) {

    const [textIndex, _] = useContext(CurrentTextIndex)
    const isPhone = useMediaQuery({
        query: "(max-width: 700px)"
    })

    return (
        <>
            {!isPhone && index!==textIndex?
                null
                :
                <section className={styles.aboutText}>
                    <h3 className={styles.title}>{title}</h3>
                    {children}
                </section>
            }
        </>
    )
}