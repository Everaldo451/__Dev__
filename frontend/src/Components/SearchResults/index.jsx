import { useState, useEffect, useRef, useContext } from "react"
import { User, CSRFContext } from "../../MainContexts"
import CourseRouteCommonButton from "../CourseRouteCommonButton"
import axios from "axios"
import styles from "./index.module.css"
import { useNavigate } from "react-router-dom"

function Select ({children, attrs ,setLanguage}) {

    const ref = useRef(null)

    function onChange(e) {
        const selected = ref.current.options[ref.current.options.selectedIndex]
        
        setLanguage(selected.value!=""?selected.value:null)
    }

    return <select {...attrs} ref={ref} onChange={onChange}>{children}</select>
}

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

function AddCourse() {

    const [user, _] = useContext(User)
    const [csrf_token, setCSRFToken] = useContext(CSRFContext)

    console.log(user.user_type)

    const navigate = useNavigate()

    const [formRendered, setFormRendered] = useState(false)
    const formRef = useRef(null)

    async function onSubmit(e) {
        e.preventDefault()
        const data = new FormData(e.target)
        data.forEach((value,key) => {console.log(key, value)})

        try {
            await axios({
                url: e.target.action,
                withCredentials: true,
                data: data,
                headers: {
                    'X-CSRFToken':`${csrf_token}`,
                },
                method: e.target.method
            })

            navigate("/")
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
                    action="http://localhost:5000/courses/create"
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

function Result({course, subscribe}) {

    const [hover,setHover] = useState(false)
    const [csrf_token, setCSRFToken] = useContext(CSRFContext)
    const [user, setUser] = useContext(User)

    async function Subscribe() {

        let route = subscribe==true?"subscribe":"unsubscribe"

        try{

        const response = await axios.post(`http://localhost:5000/courses/${route}/${course.id}`,undefined,
            {
                withCredentials: true,
                'X-CSRFToken':`${csrf_token}`
            }
        )
        } catch(error) {}
        window.location.assign('/')
    }

    return (
        <section 
            className={styles.Course} 
            onMouseEnter={(e) => {setHover(!hover)}} 
            onMouseLeave={(e) => {setHover(!hover)}}
        >
            <div className={styles.imageContainer}>
                <img src={course.image} width={100}></img>
            </div>
            <p style={{textAlign:"center"}}>{course.name}</p>
            <p className={styles.data}>
                <span>Language: </span>
                <span style={{textDecoration:"underline", color:"inherit"}}>{course.language}</span>
            </p>
            <p className={styles.data}>
                <span>Professores: </span>
                {course.teachers}
            </p>
            <p className={styles.data}>
                <span>Alunos: </span>
                {course.students}
            </p>
            <p className={styles.data} style={{marginTop:10}}>
                <span>Descrição: </span>
            </p>
            <p className={styles.data}>{course.description}</p>
            {hover == true?
                <div style={{display:"flex",justifyContent:"center"}}>
                    {user.user_type != "TEACHER"?
                        <button onClick={(e) => {e.preventDefault();Subscribe()}}>
                            {subscribe?"Se inscrever":"Se desinscrever"}
                        </button>
                        :null
                    }
                    {!subscribe?
                        <CourseRouteCommonButton>
                            Acessar curso
                        </CourseRouteCommonButton>
                        :null
                    }
                </div>
                :null
            }
        </section>
    )

}


function SearchResults({courses, subscribe, area}){

    const [language, setLanguage] = useState(null)
    const [currentCourses, setCurrentCourses] = useState(courses)
    const [user, setUser] = useContext(User)

    useEffect(() => {
        setCurrentCourses(language!=null?courses.filter(course => course.language == language):courses)
    },[language,courses])

    return (
        <>
            {area == true && user.user_type == "TEACHER"?
                <AddCourse/>
                :null
            }
            <div className={styles.resultsLanguage}>
                {area == true?
                    <h2 style={{color:"white"}}>Meus Cursos:</h2>
                    :
                    <h2 style={{color:"white"}}>Cursos:</h2>
                }
                <Select setLanguage={setLanguage}>
                    <option selected value="">None</option>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                </Select>
            </div>
            <section className={styles.courses}>

                {currentCourses.map(course => 
                    <Result course={course} key={course.key} subscribe={subscribe}/>
                )}

            </section>
        </>
    )

}


export default SearchResults