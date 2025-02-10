import styles from "./index.module.css"

interface SubscribeSectionProps {
    slideIn: boolean
    children: React.ReactNode
}

export default function SubscribeSection({slideIn, children}:SubscribeSectionProps) {

    return (
        <section className={`${styles.subscribe} ${slideIn?styles.slideIn:styles.slideOut}`}>
            <h3>Do you want subscribe?</h3>
            <div className={styles.buttonContainer}>
                {children}
            </div>
        </section>
    )

}