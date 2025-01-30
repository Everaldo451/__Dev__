import { useState, useRef, useEffect } from "react"
import { Languages } from "../../../Languages"
import styles from "./index.module.css"

export default function LanguageSelector ({attrs}) {

    const selectRef = useRef(null)
    const [languages, setLanguages] = useState([{value:"", placeholder:"None"}])
    const [placeholder, setPlaceHolder] = useState("None")
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        Languages.forEach((value, key) => {
            setLanguages(prev => [...prev, {value:value, placeholder:value}])
        })
    },[])

    function onOptionClickConstructor(option){

        return function onClick(e) {
            e.preventDefault()

            for (const opt of selectRef.current.options) {
                if (option.placeholder == opt.label) {
                    selectRef.current.value=option.value
                    setPlaceHolder(option.placeholder)
                }
            }

            setVisible(false)
        }
    }

    function onClick(e) {
        e.preventDefault()
        setVisible(prev => !prev)
    }

    return (
        <div className={styles.selector}>
            <select ref={selectRef} {...attrs} className={styles.select} defaultValue={""}>
                {languages.map((value) => <option value={value.value}>{value.placeholder}</option>)}
            </select>

            <div className={styles.select}>
                <button onClick={onClick}>{placeholder}</button>
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