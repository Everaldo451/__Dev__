import { useEffect, useState } from "react"
import styles from "./index.module.css"

export default function NameField({setFilterSwitchs}) {
    const [value, setValue] = useState("")

    useEffect(()=>{
        setFilterSwitchs(prev => ({...prev, 
            "name": (courseKeyValue, filterValue) => {
                return courseKeyValue.includes(filterValue)
            }
        }))
    },[])
    return (
        <div>
            <label>Name</label>
            <input 
                className={styles.Name} 
                type="text" 
                placeholder="nome do curso" 
                onInput={(e) => {setValue(e.target.value)}}
            />
            <input type="hidden" name="name" value={value}/>
        </div>
    )
}