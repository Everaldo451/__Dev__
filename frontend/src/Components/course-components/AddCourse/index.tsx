import { useContext, SetStateAction } from "react"
import { CSRFContext } from "../../../contexts/CSRFContext"

import StyledNameField from "../form-fields/StyledNameField/index"
import StyledLanguageField from "../form-fields/StyledLanguageField/index"
import StyledSubmitInput from "../form-fields/StyledSubmitInput/index"
import StyledFileField from "../form-fields/StyledFileField/index"
import StyledDescriptionField from "../form-fields/StyledDescriptionField"

import { CourseType } from "../../../types/CourseType"
import { courseImageToBlobURL } from "../../../utils/courseListModifiers"

import axios from "axios"
import styles from "./index.module.css"

interface AddCourseProps {
    setCourses: React.Dispatch<SetStateAction<CourseType[]>>,
    hiddenState: [boolean, React.Dispatch<SetStateAction<boolean>>],
    slideIn: boolean
}

export default function AddCourse({setCourses, hiddenState, slideIn}:AddCourseProps) {

    const [csrf_token, _] = useContext(CSRFContext)
    const [hidden, setHidden] = hiddenState

    async function onSubmit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        
        try {
            const response = await axios({
                url: e.currentTarget.action,
                withCredentials: true,
                data: data,
                headers: {
                    'X-CSRFToken':`${csrf_token}`,
                },
                method: e.currentTarget.method
            })

            if (response.status == 200 && response.data.course satisfies CourseType) {
                console.log(response.data.course)
                setCourses(prev => [courseImageToBlobURL({...response.data.course}), ...prev])
                setHidden(false)
            }
        } catch (error) {console.log(error)} 
    }

    return (
        <>
            <button onClick={(e) => {setHidden(!hidden)}} className={styles.addCourse}/>
            {!hidden?
                <form 
                    encType="multipart/form-data" 
                    className={`${styles.createCourse} ${slideIn?styles.slideIn:styles.slideOut}`} 
                    action="/api/courses"
                    method="POST"
                    onSubmit={onSubmit}
                >
    
                    <StyledNameField name="name" id="name"/>
                    <StyledLanguageField name="language" id="language"/>
                    <div className={styles.price}>
                        <label>Price</label>
                        <input type="number" name="price" min={0} max={1000}/>
                    </div>
                    <StyledDescriptionField name="description" id="description"/>
                    <StyledFileField name="image" id="image" required={true}/>
                    <StyledSubmitInput value="Enter"/>
                </form>
                :null
            }
        </>
    )


}
