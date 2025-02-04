import { SetStateAction } from "react"
import styles from "./index.module.css"

interface BoxProps {
    text:string,
    image:string, 
    setattr:React.Dispatch<SetStateAction<string|null>>,
    box:string
}

function Box({text,image,setattr,box}:BoxProps) {

    return (
    <>
    <div className={styles.box} onClick={() => {setattr(box)}}>
        <h3 className={styles.Head}>{text}</h3>
        <img className={styles.Image} src={image}/>
    </div>
    </>
    )
}

export default Box