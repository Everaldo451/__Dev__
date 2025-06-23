import styles from "./index.module.css"

interface ButtonProps {
    attrs: React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
}

export default function Button({attrs}:ButtonProps) {
    return <button {...attrs} className={`${styles.styledButton} ${attrs.className}`}/>
}