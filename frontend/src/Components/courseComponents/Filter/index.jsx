import { useState } from "react"
import AnimatedImage from "./AnimatedImage"
import styles from "./index.module.css"

function FilterSection({setHidden}) {
    return(
        <>
            <div className={styles.camada} onClick={(e)=>{setHidden(true)}}/>
            <section className={styles.filter}>

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