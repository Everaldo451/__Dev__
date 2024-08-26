import styles from "./index.module.css"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import SearchBar from "../../Components/SearchBar"
import SearchResults from "../../Components/SearchResults"
import { AccessToken } from "../../main"



function Select ({children, attrs ,setLanguage}) {

    const ref = useRef(null)

    function onChange(e) {

        const selected = ref.current.options[ref.current.options.selectedIndex]
        
        if (selected.value != "") {setLanguage(selected.value)}
        else {setLanguage(null)}

    }

    return <select {...attrs} ref={ref} onChange={onChange}>{children}</select>

}


function CourseRoute() {

    const [courses, setCourses] = useState([])
    const token = useContext(AccessToken)
    const {name} = useParams()

    async function GetCourse() {
        try {

            const response = await axios.get(`http://localhost:5000/courses/getcourses/${name}`)
            const array = []

            if (response.data) {

                for (const course of response.data.courses) {
                    array.push({...course, key:courses.length + array.length + 1})
                }
                setCourses(prevCourses => [...prevCourses,...array])

            }

        } catch(error) {}
    }

    useEffect(() => {
        setCourses([])
        GetCourse()
    },[name])

    return (
    <>
        <main className={styles.CourseRoute}>
            <div className={styles.Container}><SearchBar/></div>
            <SearchResults courses={courses} token={token}/>
        </main>
    </>
    )

}


export default CourseRoute