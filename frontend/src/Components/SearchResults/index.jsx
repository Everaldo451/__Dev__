import { useState, useEffect, useRef } from "react"
import styles from "./index.module.css"

function Select ({children, attrs ,setLanguage}) {

    const ref = useRef(null)

    function onChange(e) {
        const selected = ref.current.options[ref.current.options.selectedIndex]
        
        setLanguage(selected.value!=""?selected.value:null)
    }

    return <select {...attrs} ref={ref} onChange={onChange}>{children}</select>
}




function SearchResults({courses}){

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
                <section key={course.key} className={styles.Course}>
                    <img src={course.image} width={100}></img>
                    <p style={{textAlign:"center"}}>{course.name}</p>
                    <p style={{margin:0}}>
                        <span style={{color:"rgb(131, 85, 0)"}}>Language: </span>
                        <span style={{textDecoration:"underline"}}>{course.language}</span>
                    </p>
                    <p>{course.description}</p>
                </section>)}

            </section>
        </>
    )

}


export default SearchResults