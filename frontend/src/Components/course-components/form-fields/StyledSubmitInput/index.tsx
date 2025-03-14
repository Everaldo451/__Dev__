import styles from "./index.module.css"

export default function StyledSubmitInput(
    attrs: React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>,HTMLInputElement> & React.AllHTMLAttributes<HTMLInputElement>
) {

    return(
        <input type="submit" className={styles.submit} {...attrs}/>
    )
    
}