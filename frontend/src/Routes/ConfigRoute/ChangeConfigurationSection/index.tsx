import SlideSection, {SlideSectionProps} from "../../../components/SlideSection"
import CustomButton from "../../../components/CustomButton"
import styles from "./index.module.css"
import { SetStateAction } from "react"

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
                <CustomButton>Yes</CustomButton>
            </div>
        </SlideSection>
    )

}