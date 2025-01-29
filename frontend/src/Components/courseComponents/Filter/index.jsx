import { useState } from "react"
import AnimatedImage from "./AnimatedImage"
import { CourseFiltersContext } from "../../../contexts/CourseFilters"
import styles from "./index.module.css"

function Filter({slideIn}) {
    return (
        <section className={`${styles.filter} ${slideIn?styles.filterIn:styles.filterOut}`}>
        </section>
    )
}

function DarkMask({setHidden, slideIn, setSlideIn}) {
    return(
        <div 
            className={`${styles.darkMask} ${slideIn?styles.darkMaskIn:styles.darkMaskOut}`} 
            onClick={(e)=>{setSlideIn(false)}}
            onAnimationEnd={(e) => {!slideIn?setHidden(true):null}}
        />
    )
}

export default function FilterContainer({hidden, setHidden}) {
    const [slideIn, setSlideIn] = useState(!hidden)

    return (
        <>  
            {!hidden?<DarkMask setHidden={setHidden} slideIn={slideIn} setSlideIn={setSlideIn}/>:null}
            <Filter slideIn={slideIn}/>
        </>
    )
}