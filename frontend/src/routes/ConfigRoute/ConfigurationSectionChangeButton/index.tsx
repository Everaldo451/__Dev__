import React, { SetStateAction } from "react";
import styles from "./index.module.css"

export interface ChangeConfigurationSectionButtonProps {
    setConfigSection: React.Dispatch<SetStateAction<JSX.Element|null>>,
    configSection: JSX.Element,
    image: string
}

export default function ConfigurationSectionChangeButton(
    {configSection, setConfigSection, image}: ChangeConfigurationSectionButtonProps
) {
    async function onClick() {
        setConfigSection(configSection)
    }

    return (
        <button className={styles.Button} onClick={onClick}>
            <img src={image} className={styles.buttonImage}/>
        </button>
    )

}