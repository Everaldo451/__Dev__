import { useEffect, useRef, useState } from "react"
import AnimatedImage from "./AnimatedImage"
import styles from "./index.module.css"

function FilterSection({setHidden}) {
    const [slideIn, setSlideIn] = useState(true)

    return(
        <>
            <div 
                className={`${styles.darkMask} ${slideIn?styles.darkMaskIn:styles.darkMaskOut}`} 
                onClick={(e)=>{setSlideIn(false)}}
                onAnimationEnd={(e) => {!slideIn?setHidden(true):null}}
            />
            <section 
                className={`${styles.filter} ${slideIn?styles.filterIn:styles.filterOut}`}
            >
            </section>
        </>
    )
}

export default function Filter() {
    const [hidden, setHidden] = useState(true)

    return (
        <>
            <button className={styles.Button} onClick={(e) => {setHidden(false)}}>
                <AnimatedImage/>
            </button>
            {!hidden?<FilterSection setHidden={setHidden}/>:null}
        </>
    )
}