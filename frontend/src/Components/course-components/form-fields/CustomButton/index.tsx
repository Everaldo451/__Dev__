import styles from "./index.module.css"

export default function CustomButton(
    args:React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
) {

    return (
        <button className={styles.custom} {...args}>{args.children}</button>
    )
}