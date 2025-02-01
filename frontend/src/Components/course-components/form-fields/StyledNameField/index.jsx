import styles from "./index.module.css"

export default function StyledNameField(attrs) {

    return (
        <div>
            <label>Name</label>
            <input className={styles.Name} type="text" placeholder="nome do curso" {...attrs}/>
        </div>
    )

}