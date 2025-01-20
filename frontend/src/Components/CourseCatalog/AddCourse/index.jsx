import { useState, useRef, useContext } from "react"
import { User, CSRFContext, Courses } from "../../../MainContexts"
import CourseRouteCommonButton from "../../CourseRouteCommonButton"
import { courseImageToBlobURL } from "../../../utils/courseListModifiers"
import axios from "axios"
import styles from "./index.module.css"
import { useNavigate } from "react-router-dom"

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

export default function AddCourse() {

    const [user, _] = useContext(User)
    const [courses, setCourses] = useContext(Courses)
    const [csrf_token, setCSRFToken] = useContext(CSRFContext)

    const [formRendered, setFormRendered] = useState(false)
    const formRef = useRef(null)

    async function onSubmit(e) {
        e.preventDefault()
        const data = new FormData(e.target)

        data.forEach((value,key) => {console.log(key, value)})
        
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
                setCourses(prev => {
                    const set = new Set([courseImageToBlobURL({...response.data.course}), ...prev])
                    console.log(set)
                    return set
                })
                setFormRendered(false)
            }
        } catch (error) {} 
    }

    return (
        <>
            <CourseRouteCommonButton onClick={(e) => {setFormRendered(!formRendered)}}>Add Course</CourseRouteCommonButton>
            {formRendered==true?
                <form 
                    ref={formRef} 
                    encType="multipart/form-data" 
                    className={styles.CreateCourse} 
                    action="/api/courses/create"
                    method="POST"
                    onSubmit={onSubmit}
                >
                    <FileInput/>

                    <div>
                        <label htmlFor="name">Nome do curso:</label>
                        <input type="text" name="name" placeholder="Insira o nome do seu curso" required/>
                    </div>

                    <div>
                        <label htmlFor="language">Linguagem:</label>
                        <input type="text" name="language" placeholder="Insira a linguagem" required/>
                    </div>

                    <div>
                        <label htmlFor="description">Descrição:</label>
                        <textarea name="description" required/>
                    </div>

                    <input type="submit" value={"Enter"}/>

                </form>
                :null
            }
        </>
    )


}
