import { SetStateAction, useEffect } from "react"
import { FilterType } from ".."
import StyledLanguageField from "../../form-fields/StyledLanguageField"

export default function LanguageField(
    {setFilterSwitchs}:{setFilterSwitchs:React.Dispatch<SetStateAction<{[key:string]:FilterType}>>}
) {

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
        <StyledLanguageField name="language"/>
    )

}