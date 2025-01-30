import { useEffect } from "react"
import LanguageSelector from "../../LanguageSelector"
import styles from "./index.module.css"

export default function LanguageField({setFilterSwitchs}) {

    useEffect(()=>{
        setFilterSwitchs(prev => ({...prev, 
            "language":(courseKeyValue, filterValue) => {
                if (filterValue.length==0){return true}
                return courseKeyValue==filterValue
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