import styles from "./index.module.css"

export default function NameField() {
    return (
        <div>
            <label>Name</label>
            <input className={styles.Name} type="text" placeholder="nome do curso"/>
        </div>
    )
}