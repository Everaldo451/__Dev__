import { CurrentTextIndex, CurrentTitle } from "../AboutUsTextChanger";
import React, { useContext, useEffect } from "react";
import styles from "./index.module.css"

interface AboutTextProps {
    children: React.ReactNode,
    title: string,
    index: number
}

export default function AboutText({children, title, index}:AboutTextProps) {

    const [textIndex, _] = useContext(CurrentTextIndex)
    const [__, setTitle] = useContext(CurrentTitle)

    useEffect(() => {
        textIndex==index?setTitle(title):null
    },[textIndex])

    return (
        <>
            {index!==textIndex?
                null
                :
                <section className={styles.aboutText}>
                    {children}
                </section>
            }
        </>
    )
}