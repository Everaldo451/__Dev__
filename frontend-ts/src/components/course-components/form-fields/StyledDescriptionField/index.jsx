import styles from "./index.module.css"

export default function StyledDescriptionField(attrs) {
    return (
        <div className={styles.description}>
            <label htmlFor={attrs.id?attrs.id:null}>Description</label>
            <textarea name="description" {...attrs}/>
        </div>
    )
}