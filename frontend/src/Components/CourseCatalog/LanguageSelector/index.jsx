import { useRef } from "react"
import styles from "./index.module.css"

export default function LanguageSelector ({children, attrs ,setLanguage}) {

    const ref = useRef(null)

    function onChange(e) {
        const selected = ref.current.options[ref.current.options.selectedIndex]
        
        setLanguage(selected.value!=""?selected.value:null)
    }

    return <select {...attrs} ref={ref} onChange={onChange}>{children}</select>
}