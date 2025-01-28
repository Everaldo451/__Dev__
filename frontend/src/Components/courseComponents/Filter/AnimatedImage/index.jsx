import { useState } from "react"
import styles from "./index.module.css"

function Line({distance, hover}) {
    return (
        <div className={styles.Line} style={{"--distance":distance}}>
            <div className={styles.Ball}/>
        </div>
    )
}

export default function AnimatedImage() {
    const [hover, setHover] = useState(false)

    function onMouse(e) {setHover(prev => !prev)}

    return (
        <div className={styles.AnimatedImage} onMouseEnter={onMouse} onMouseLeave={onMouse}>
            <Line distance={"25%"} hover={hover}/>
            <Line distance={"70%"} hover={hover}/>
            <Line distance={"40%"} hover={hover}/>
        </div>
        
    )

}