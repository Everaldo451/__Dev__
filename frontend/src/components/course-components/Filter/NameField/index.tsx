import { SetStateAction, useEffect, useState } from "react"
import { FilterType } from ".."
import StyledNameField from "../../form-fields/StyledNameField"

export default function NameField(
    {setFilterSwitchs}:{setFilterSwitchs: React.Dispatch<SetStateAction<{[key:string]:FilterType}>>}
) {
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
        <StyledNameField onInput={(e) => {setValue(e.currentTarget.value)}}/>
        <input type="hidden" name="name" value={value}/>
        </>
    )
}