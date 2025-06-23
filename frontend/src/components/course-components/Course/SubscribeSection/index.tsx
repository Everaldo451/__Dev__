import SlideSection, {SlideSectionProps} from "../../../SlideSection"
import styles from "./index.module.css"

interface SubscribeSectionProps {
    message: string,
}

export default function SubscribeSection(
    {slideIn, message, children}:SubscribeSectionProps & Omit<SlideSectionProps, "classNames">
) {
    return (
        <SlideSection slideIn={slideIn} classNames={[styles.subscribe]}>
            <h3 className={styles.title}>{message}</h3>
            <div className={styles.buttonContainer}>
                {children}
            </div>
        </SlideSection>
    )
}