import styles from "./index.module.css"

export function DarkMask({setHidden, slideIn, setSlideIn}) {
    return(
        <div 
            className={`${styles.darkMask} ${slideIn?styles.darkMaskIn:styles.darkMaskOut}`} 
            onClick={(e)=>{setSlideIn(false)}}
            onAnimationEnd={(e) => {!slideIn?setHidden(true):null}}
        />
    )
}