import { SetStateAction } from "react"
import ChangeConfigurationSectionButton from "../ChangeConfigurationSectionButton"
import ConfigurationSection from "../ConfigurationSection"
import styles from "./index.module.css"
import { UserType } from "../../types/UserType"

interface SideMenuProps {
    setConfigSection: React.Dispatch<SetStateAction<JSX.Element|null>>,
    user: UserType
}

export default function SideMenu({setConfigSection, user}:SideMenuProps) {

    return (
        <section className={styles.sideMenu}>
            <ChangeConfigurationSectionButton 
                image=""
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