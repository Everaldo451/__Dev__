import { ConfigProps } from "../Config"
import Config from "../Config"
import styles from "./index.module.css"

interface ConfigurationSectionProps {
    configurations: ConfigProps[],
    title: string,
}

export default function ConfigurationSection({configurations, title}: ConfigurationSectionProps) {

    return (
        <section className={styles.configSection}>
            <h2>{title}</h2>
            {configurations.map((value) => <Config {...value}/>)}
        </section>
    )
}