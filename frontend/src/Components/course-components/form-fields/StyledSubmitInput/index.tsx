import styles from "./index.module.css"

export default function StyledSubmitInput(
    attrs: React.AllHTMLAttributes<HTMLInputElement>
) {

    return(
        <input type="submit" className={styles.submit} {...attrs}/>
    )
    
}