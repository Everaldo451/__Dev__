import styles from "./index.module.css"

export default function StyledDescriptionField(
    attrs:React.AllHTMLAttributes<HTMLTextAreaElement>
) {
    return (
        <div className={styles.description}>
            <label htmlFor={attrs.id?attrs.id:undefined}>Description</label>
            <textarea name="description" {...attrs}/>
        </div>
    )
}