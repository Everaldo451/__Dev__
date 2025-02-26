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
            className={`${styles.darkMask} ${slideIn?styles.active:""}`} 
            onClick={(_)=>{setSlideIn(false)}}
            onTransitionEnd={(_) => {!slideIn?setHidden(true):null}}
        />
    )
}