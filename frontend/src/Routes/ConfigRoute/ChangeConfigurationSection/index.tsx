import { SetStateAction, useContext } from "react"
import SlideSection, {SlideSectionProps} from "../../../components/SlideSection"
import CustomButton from "../../../components/CustomButton"
import { UserContext } from "../../../contexts/UserContext"
import { UserType } from "../../../types/UserType"
import { AxiosError } from "axios"
import { api } from "../../../api/api"
import styles from "./index.module.css"


interface ChangeConfigurationSectionProps {
    setSlideIn: React.Dispatch<SetStateAction<boolean>>,
    configName: string,
    configValue: any
}


export default function ChangeConfigurationSection(
    {
        setSlideIn,
        slideIn,
        configName,
        configValue,
    }:Omit<SlideSectionProps,"children" | "classNames"> & ChangeConfigurationSectionProps) 
{
    const [_, setUser] = useContext(UserContext)

    async function modifyConfig(_:React.MouseEvent<HTMLButtonElement>) {
        try {
            const response = await api.patch("/me", {
                [configName]: configValue
            })
            
            if (response.status==200) {
                setUser(prev => prev?{...prev, [configName as keyof UserType]:configValue}:null)
                setSlideIn(prev => !prev)
            }
        } catch (error) {
            if (error instanceof AxiosError) {}
        }
    }

    return (
        <SlideSection slideIn={slideIn}>
            <h3 className={styles.title}>
                Do you want change your {configName.split("_")
                    .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
                    .join(" ")
                }?
            </h3>
            <div className={styles.buttonsContainer}>
                <CustomButton onClick={(_) => {setSlideIn(prev => !prev)}}>No</CustomButton>
                <CustomButton onClick={modifyConfig}>Yes</CustomButton>
            </div>
        </SlideSection>
    )

}