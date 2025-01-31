import { useEffect } from "react"
import LanguageSelector from "../../LanguageSelector"
import styles from "./index.module.css"

export default function LanguageField({setFilterSwitchs}) {

    useEffect(()=>{
        setFilterSwitchs(prev => ({...prev, 
            "language":{
                "function": (courseKeyValue, filterValue) => {
                    return courseKeyValue==filterValue
                },
                "defaultValue":""
            }
        }))
    },[])
    return (
        <div className={styles.inputContainer}>
            <label>Language</label>
            <LanguageSelector attrs={{name:"language"}}/>
        </div>
    )

}