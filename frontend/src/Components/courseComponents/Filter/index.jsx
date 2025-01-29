import { useContext, useEffect, useState } from "react"
import { CourseFiltersContext } from "../../../contexts/CourseFilters"
import NameField from "./NameField"
import PriceField from "./PriceField"
import styles from "./index.module.css"

function Filter({slideIn}) {
    return (
        <section className={`${styles.filter} ${slideIn?styles.filterIn:styles.filterOut}`}>
            <NameField/>
            <PriceField/>
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
    const [filters, setFilters] = useContext(CourseFiltersContext)

    useEffect(() => {
        setSlideIn(!hidden)
    },[hidden])

    return (
        <>  
            {!hidden?<DarkMask setHidden={setHidden} slideIn={slideIn} setSlideIn={setSlideIn}/>:null}
            <Filter slideIn={slideIn}/>
        </>
    )
}