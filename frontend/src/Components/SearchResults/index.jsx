import { useState, useEffect, useRef, useContext } from "react"
import { AccessToken, User, CSRFContext } from "../../main"
import axios from "axios"
import styles from "./index.module.css"

function Select ({children, attrs ,setLanguage}) {

    const ref = useRef(null)

    function onChange(e) {
        const selected = ref.current.options[ref.current.options.selectedIndex]
        
        setLanguage(selected.value!=""?selected.value:null)
    }

    return <select {...attrs} ref={ref} onChange={onChange}>{children}</select>
}

function AddCourse() {

    const user = useContext(User)
    const csrf = useContext(CSRFContext)
    const token = useContext(AccessToken)

    if (user.user_type == "teacher") {

        const [displayIsNone, setDisplayIsNone] = useState(true)

        const ref = useRef(null)

        function OnClick(e) {

            ref.current.style.display = displayIsNone?'block':'none'

            setDisplayIsNone(!displayIsNone)
        }

        async function onSubmit(e) {
            e.preventDefault()

            const data = new FormData(e.target)
            data.forEach((value,key) => {console.log(key, value)})

            try {
                console.log(csrf, token)

                const response = await axios({
                    url: e.target.action,
                    withCredentials: true,
                    data: data,
                    headers: {
                        'Authorization':`Bearer ${token}`,
                        'X-CSRFToken':`${csrf}`,
                    },
                    method: e.target.method
                })

                console.log(response.data)
            } catch (error) {} 

        }

        return (
            <>
                <button onClick={OnClick}>add course</button>
                <form 
                    ref={ref} 
                    enctype="multipart/form-data" 
                    className={styles.CreateCourse} 
                    action="http://localhost:5000/courses/create"
                    method="POST"
                    onSubmit={onSubmit}
                >
                    <div>
                        <label htmlFor="image">Logo do curso:</label>
                        <input type="file" name="image" required/>
                    </div>

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
            </>
        )
    }

    return <></>
}

function Result({course, subscribe}) {

    const [hover,setHover] = useState(false)
    const csrf = useContext(CSRFContext)
    const token = useContext(AccessToken)
    const user = useContext(User)

    console.log(course)

    console.log(subscribe)

    async function Subscribe() {

        let route = subscribe==true?"subscribe":"unsubscribe"

        try{

        const response = await axios.post(`http://localhost:5000/courses/${route}/${course.id}`,undefined,
            {
                withCredentials: true,
                'Authorization':`Bearer ${token}`,
                'X-CSRFToken':`${csrf}`
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
            {hover == true && token?
                <div style={{display:"flex",justifyContent:"center"}}>
                    {user.user_type != "TEACHER"?
                        <button onClick={(e) => {e.preventDefault();Subscribe()}}>
                            {subscribe?"Se inscrever":"Se desinscrever"}
                        </button>
                        :null
                    }
                    {!subscribe?
                        <button>
                            Acessar curso
                        </button>
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
    const user = useContext(User)

    useEffect(() => {
        setCurrentCourses(language!=null?courses.filter(course => course.language == language):courses)
    },[language,courses])

    return (
        <>
            {area == true && user.user_type=="TEACHER"?
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