import { useState, useRef, useEffect } from "react"
import CustomButon from "../../CustomButton"
import { Languages } from "../../../../../enums/Languages"
import styles from "./index.module.css"

interface LanguageOption {
    value: string,
    placeholder: string
}

export default function LanguageSelector (
    attrs: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSelectElement>, HTMLSelectElement>
) {

    const selectRef = useRef<HTMLSelectElement>(null)
    const [languages, setLanguages] = useState<LanguageOption[]>([{value:"", placeholder:"None"}])
    const [placeholder, setPlaceHolder] = useState("None")
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        for (const [_, language] of Object.entries(Languages)) {
            setLanguages(prev => [...prev, {value:language, placeholder:language}])
        }
    },[])

    function onOptionClickConstructor(option: LanguageOption){

        return function onClick(e:React.MouseEvent<HTMLButtonElement>) {
            e.preventDefault()

            if (selectRef.current) {

                for (const opt of selectRef.current.options) {
                    if (option.placeholder == opt.label) {
                        selectRef.current.value=option.value
                        setPlaceHolder(option.placeholder)
                    }
                }
            }

            setVisible(false)
        }
    }

    function onClick(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        setVisible(prev => !prev)
    }

    return (
        <div className={styles.selector}>
            <select ref={selectRef} {...attrs} className={styles.select} defaultValue={""}>
                {languages.map((value) => <option value={value.value}>{value.placeholder}</option>)}
            </select>

            <div className={styles.select}>
                <CustomButon onClick={onClick}>{placeholder}</CustomButon>
                <div className={styles.options} style={{display:visible?"block":"none"}}>
                    {languages.map((value) => 
                        <button onClick={onOptionClickConstructor(value)}>
                            {value.placeholder}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}