import { SetStateAction } from "react"

import StyledNameField from "../form-fields/StyledNameField/index"
import StyledLanguageField from "../form-fields/StyledLanguageField/index"
import StyledSubmitInput from "../form-fields/StyledSubmitInput/index"
import StyledFileField from "../form-fields/StyledFileField/index"
import StyledDescriptionField from "../form-fields/StyledDescriptionField"

import { CourseType } from "../../../types/CourseType"
import { CourseHashMap, courseArrayToHashMap } from "../../CourseCatalog/courseInCacheFunctions"
import { courseImageToBlobURL } from "../../../utils/courseListModifiers"

import { api } from "../../../api/api"
import styles from "./index.module.css"

interface AddCourseProps {
    setCourses: React.Dispatch<SetStateAction<CourseType[]>>,
    setLoadedCoursesHashMap: React.Dispatch<SetStateAction<CourseHashMap>>
    hiddenState: [boolean, React.Dispatch<SetStateAction<boolean>>],
    slideIn: boolean
}

export default function AddCourse(
    {setCourses, setLoadedCoursesHashMap, hiddenState, slideIn}:AddCourseProps
) {
    
    const [hidden, setHidden] = hiddenState

    async function onSubmit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        
        try {
            const response = await api({
                url: e.currentTarget.action,
                withCredentials: true,
                data: data,
                method: e.currentTarget.method
            })

            if (response.status == 200 && response.data.course satisfies CourseType) {
                const course:CourseType = response.data.course
                const {id, ...others} = course
                console.log(course)
                setCourses(prev => [courseImageToBlobURL({...course}), ...prev])
                setLoadedCoursesHashMap(prev => ({...prev, [String(id)]: others }))
                setHidden(false)
            }
        } catch (error) {console.log(error)} 
    }

    return (
        <>
            <button onClick={(_) => {setHidden(!hidden)}} className={styles.addCourse}/>
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
