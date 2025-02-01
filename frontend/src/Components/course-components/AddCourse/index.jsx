import { useState, useRef, useContext } from "react"
import { CSRFContext } from "../../../contexts/mainContexts"
import StyledNameField from "../form-fields/StyledNameField/index"
import StyledLanguageField from "../form-fields/StyledLanguageField/index"
import StyledSubmitInput from "../form-fields/StyledSubmitInput/index"
import { courseImageToBlobURL } from "../../../utils/courseListModifiers"
import axios from "axios"
import styles from "./index.module.css"

function FileInput() {

    const fileInputRef = useRef(null)
    const [fileValue, setFileValue] = useState("")

    function fileValueChange(e) {
        const regex = /\\\w+\\(.+\.\w+)/
        const value = e.currentTarget.value.match(regex)
        console.log(value)
        setFileValue(value?value[1]:"")
    }

    return (
        <div className={styles.fileDiv}>
            <div>
                <label htmlFor="image">Logo:</label>
                <input type="file" name="image" required ref={fileInputRef} onInput={fileValueChange}/>
                <button onClick={(e) => {fileInputRef.current.click()}}>Upload</button>
            </div>
            <span>{fileValue}</span>
        </div>
    )

}

export default function AddCourse({setCourses, hiddenState, slideIn}) {

    const [csrf_token, _] = useContext(CSRFContext)
    const [hidden, setHidden] = hiddenState

    async function onSubmit(e) {
        e.preventDefault()
        const data = new FormData(e.target)
        
        try {
            const response = await axios({
                url: e.target.action,
                withCredentials: true,
                data: data,
                headers: {
                    'X-CSRFToken':`${csrf_token}`,
                },
                method: e.target.method
            })

            if (response.status == 200 && response.data.course) {
                setCourses(prev => [courseImageToBlobURL({...response.data.course}), ...prev])
                setHidden(false)
            }
        } catch (error) {} 
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
                    {/*<FileInput/>

                    <div>
                        <label htmlFor="description">Descrição:</label>
                        <textarea name="description" required/>
                    </div>

                    <div>
                        <label htmlFor="price">Preço:</label>
                        <input type="number" name="price" min={0} max={1000}/>
                    </div>*/}

                    <StyledNameField name="name"/>
                    <StyledLanguageField name="language"/>
                    <StyledSubmitInput value="Enter"/>
                </form>
                :null
            }
        </>
    )


}
