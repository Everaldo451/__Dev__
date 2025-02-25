import { useEffect, useRef, useState } from "react"
import DarkMask from "../../../components/DarkMask"
import CustomButton from "../../../components/CustomButton"
import ChangeConfigurationSection from "../ChangeConfigurationSection"
import styles from "./index.module.css"

export interface ConfigProps {
    children: React.ReactNode,
    attrs: React.AllHTMLAttributes<HTMLInputElement>,
}

export default function Config({children, attrs}:ConfigProps){

    const [val, setValue] = useState(attrs.value)
    const [hidden, setHidden] = useState(true)
    const [slideIn, setSlideIn] = useState(false)
    const ref = useRef<HTMLInputElement>(null)

    function onInput(e:React.FormEvent<HTMLInputElement>) {e.preventDefault();setValue(ref.current?.value)}

    useEffect(() => {
        setSlideIn(!hidden)
    }, [hidden])

    return (
        <>
        {!hidden?
            <>
                <DarkMask setHidden={setHidden} setSlideIn={setSlideIn} slideIn={slideIn}/>
                <ChangeConfigurationSection 
                    setSlideIn={setSlideIn}
                    slideIn={slideIn} 
                    configName={attrs.name?attrs.name:""} 
                    configValue={val}
                />
            </>
            :null
        }
        <div className={styles.Config}>
            <div className={styles.InputContainer}>
                <label htmlFor={attrs.name} style={{marginRight:5}}>{children?.toString().toUpperCase()}</label>
                <input 
                    className={styles.OffChangeInput}
                    {...attrs} 
                    required
                    id={attrs.name} 
                    value={val}
                    ref={ref} 
                    onInput={onInput} 
                    readOnly={true}
                />
            </div>
            
            <CustomButton onClick={(_) => {setHidden(prev => !prev)}}>
                Change
            </CustomButton>
        </div>
        </>
    )
}