import { useState, useRef, useEffect } from "react"
import { Languages } from "../../../Languages"
import styles from "./index.module.css"

export default function LanguageSelector ({attrs ,setLanguage}) {

    const [options, setOptions] = useState([<option value="" key={0}>None</option>])

    function LanguageOptions(length) {
        const optionsList = []
        Languages.forEach((value, key) => {
            optionsList.push(<option value={value} key={length+1}>{value}</option>)
        })
        return optionsList
    }

    useEffect(() => {
        setOptions(prev => [...prev, ...LanguageOptions(prev.length)])
    },[])

    const ref = useRef(null)

    function onChange(e) {
        const selected = ref.current.options[ref.current.options.selectedIndex]
        setLanguage(selected.value!=""?selected.value:null)
    }

    return (<select {...attrs} ref={ref} defaultValue={""} onChange={onChange}>
        {options}
    </select>)
}