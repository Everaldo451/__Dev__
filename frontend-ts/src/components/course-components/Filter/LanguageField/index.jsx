import { useEffect } from "react"
import StyledLanguageField from "../../form-fields/StyledLanguageField"

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
        <StyledLanguageField name="language"/>
    )

}