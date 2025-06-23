import { SetStateAction } from "react"
import ConfigurationSectionChangeButton from "../ConfigurationSectionChangeButton"
import ConfigurationSection from "../ConfigurationSection"
import { UserType } from "../../../types/UserType"
import PersonalData from "../../../assets/configuration_route/dados-pessoais.png"
import styles from "./index.module.css"

interface ConfigurationSideMenuProps {
    setConfigSection: React.Dispatch<SetStateAction<JSX.Element|null>>,
    user: UserType
}

export default function ConfigurationSideMenu({setConfigSection, user}:ConfigurationSideMenuProps) {

    return (
        <section className={styles.sideMenu}>
            <ConfigurationSectionChangeButton
                image={PersonalData}
                setConfigSection={setConfigSection}
                configSection={
                    <ConfigurationSection
                        title="Personal Data"
                        configurations={[
                            {
                                attrs:{value:user.email, name:"email", type:"email"},
                                children:"email"
                            },
                            {
                                attrs:{value:user.full_name, name:"full_name", type:"text"},
                                children:"first name"
                            }
                        ]}
                    />
                }
            />
        </section>
    )
}