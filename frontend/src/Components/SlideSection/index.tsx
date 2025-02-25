import styles from "./index.module.css"

export interface SlideSectionProps {
    slideIn: boolean,
    children: React.ReactNode,
    classNames?: string[]
}

export default function SlideSection({slideIn, children, classNames}:SlideSectionProps) {

    return (
        <section 
            className={
                `${styles.sec} ${classNames?.join(" ")} ${slideIn?styles.slideIn:styles.slideOut}`
            }
        >
            {children}
        </section>
    )

}