import styles from "./index.module.css"

export default function StyledSubmitInput(attrs) {

    return(
        <input type="submit" className={styles.submit} {...attrs}/>
    )
    
}