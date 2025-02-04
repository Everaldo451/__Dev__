import styles from "./index.module.css"

export default function CustomButon(args) {

    return (
        <button className={styles.custom} {...args}>{args.children}</button>
    )
}