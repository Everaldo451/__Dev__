import LanguageSelector from "./LanguageSelector"
import styles from "./index.module.css"

export default function StyledLanguageField(
    attrs: React.AllHTMLAttributes<HTMLSelectElement>
) {

    return (
        <div className={styles.inputContainer}>
            <label htmlFor={attrs.id?attrs.id:undefined}>Language</label>
            <LanguageSelector {...attrs}/>
        </div>
    )
}