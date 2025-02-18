import styles from "./index.module.css"

interface SubscribeSectionProps {
    slideIn: boolean,
    message: string, 
    children: React.ReactNode
}

export default function SubscribeSection({slideIn, message, children}:SubscribeSectionProps) {

    return (
        <section className={`${styles.subscribe} ${slideIn?styles.slideIn:styles.slideOut}`}>
            <h3>{message}</h3>
            <div className={styles.buttonContainer}>
                {children}
            </div>
        </section>
    )

}