import { HTMLAttributes } from "react"
import styles from "./index.module.css"

export default function StyledNameField(
    attrs: React.DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement>
) {

    return (
        <div>
            <label htmlFor={attrs.id?attrs.id:undefined}>Name</label>
            <input className={styles.Name} type="text" placeholder="nome do curso" {...attrs}/>
        </div>
    )

}