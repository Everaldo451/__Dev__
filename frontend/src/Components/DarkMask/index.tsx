import { SetStateAction } from "react"
import styles from "./index.module.css"

interface DarkMaskProps {
    setHidden: React.Dispatch<SetStateAction<boolean>>,
    slideIn: boolean,
    setSlideIn: React.Dispatch<SetStateAction<boolean>>
}

export default function DarkMask({setHidden, slideIn, setSlideIn}:DarkMaskProps) {
    return(
        <div 
            className={`${styles.darkMask} ${slideIn?styles.darkMaskIn:styles.darkMaskOut}`} 
            onClick={(_)=>{setSlideIn(false)}}
            onAnimationEnd={(_) => {!slideIn?setHidden(true):null}}
        />
    )
}