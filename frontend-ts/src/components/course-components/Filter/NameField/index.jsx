import { useEffect, useState } from "react"
import StyledNameField from "../../form-fields/StyledNameField"

export default function NameField({setFilterSwitchs}) {
    const [value, setValue] = useState("")

    useEffect(()=>{
        setFilterSwitchs(prev => ({...prev, 
            "name": {
                "function": (courseKeyValue, filterValue) => {
                    return courseKeyValue.includes(filterValue)
                },
                "defaultValue":""
            }
        }))
    },[])
    return (
        <>
        <StyledNameField onInput={(e) => {setValue(e.target.value)}}/>
        <input type="hidden" name="name" value={value}/>
        </>
    )
}