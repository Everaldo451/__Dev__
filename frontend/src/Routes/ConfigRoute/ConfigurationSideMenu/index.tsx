import { SetStateAction } from "react"
import ConfigurationSectionChangeButton from "../ConfigurationSectionChangeButton"
import ConfigurationSection from "../ConfigurationSection"
import styles from "./index.module.css"
import { UserType } from "../../../types/UserType"

interface ConfigurationSideMenuProps {
    setConfigSection: React.Dispatch<SetStateAction<JSX.Element|null>>,
    user: UserType
}

export default function ConfigurationSideMenu({setConfigSection, user}:ConfigurationSideMenuProps) {

    return (
        <section className={styles.sideMenu}>
            <ConfigurationSectionChangeButton
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