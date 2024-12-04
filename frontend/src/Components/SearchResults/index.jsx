import { useState, useEffect, useRef, useContext } from "react"
import { CSRFContext } from "../../main"
import { AccessToken } from "../../main"
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



function Result({course, subscribe}) {

    const [hover,setHover] = useState(false)
    const csrf = useContext(CSRFContext)
    const token = useContext(AccessToken)


    console.log(subscribe)

    async function Subscribe() {

        let route = subscribe==true?"subscribe":"unsubscribe"

        try{

        const response = await axios.post(`http://localhost:5000/courses/${route}/${course.id}`,undefined,
            {
                withCredentials: true,
                headers: {
                    'Authorization':`Bearer ${token}`,
                    'X-CSRFToken':`${csrf}`
                }
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
            <div style={{display:"flex", justifyContent:"center"}}>
                <img src={course.image} width={100}></img>
            </div>
            <p style={{textAlign:"center"}}>{course.name}</p>
            <p style={{margin:0}}>
                <span style={{color:"rgb(131, 85, 0)"}}>Language: </span>
                <span style={{textDecoration:"underline"}}>{course.language}</span>
            </p>
            <p>{course.description}</p>
            {hover == true && token?
            <div style={{display:"flex",justifyContent:"center"}}>
                <button onClick={(e) => {e.preventDefault();Subscribe()}}>
                {subscribe?"Se inscrever":"Se desinscrever"}
                </button>
            </div>
            :null
            }
        </section>
    )

}


function SearchResults({courses, subscribe}){

    const [language, setLanguage] = useState(null)
    const [currentCourses, setCurrentCourses] = useState(courses)

    useEffect(() => {
        setCurrentCourses(language!=null?courses.filter(course => course.language == language):courses)
    },[language,courses])

    return (
        <>
            <div className={styles.resultsLanguage}>
                <h2 style={{color:"white"}}>Cursos:</h2>
                <Select setLanguage={setLanguage}>
                    <option selected value="">None</option>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                </Select>
            </div>
            <section className={styles.courses}>

                {currentCourses.map(course => 
                <Result 
                    course={course} 
                    key={course.key}
                    subscribe={subscribe}
                />)}

            </section>
        </>
    )

}


export default SearchResults