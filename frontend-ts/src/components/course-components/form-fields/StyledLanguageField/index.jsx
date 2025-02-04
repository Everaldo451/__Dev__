import LanguageSelector from "./LanguageSelector";
import styles from "./index.module.css"

export default function StyledLanguageField(attrs) {

    return (
        <div className={styles.inputContainer}>
            <label htmlFor={attrs.id?attrs.id:null}>Language</label>
            <LanguageSelector {...attrs}/>
        </div>
    )
}