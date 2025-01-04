import { useState, useRef, useEffect } from "react"
import { Languages } from "../../../Languages"
import styles from "./index.module.css"

export default function LanguageSelector ({attrs ,setLanguage}) {

    const [options, setOptions] = useState([])

    useEffect(() => {
        Languages.forEach((value,key,map) => 
            {setOptions(prev => [...prev, <option value={value} key={prev.length+1}>{value}</option>])}
        )
    },[])

    const ref = useRef(null)

    function onChange(e) {
        const selected = ref.current.options[ref.current.options.selectedIndex]
        
        setLanguage(selected.value!=""?selected.value:null)
    }

    return (<select {...attrs} ref={ref} onChange={onChange}>
        <option selected value="">None</option>
        {options}
    </select>)
}