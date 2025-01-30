import { getState } from "../../../CourseCatalog/coursesInCacheFunctions"
import { courseListLength } from "../../../../CourseListLength"
import { courseListImagesToBlobURL } from "../../../../utils/courseListModifiers"
import styles from "./index.module.css"
import axios from "axios"

export default function SubmitInput(
    {
        filterSwitchs,
        unFilteredCourses, 
        currentCourses, 
        setCurrentCourses, 
        requestData
    }
) {

    const getLocalCourses = () => getState(unFilteredCourses)

    function getFiltersData(courses, filtersFormData) {
        const filters = {
            length: courses.length
        }

        filtersFormData.forEach((value, key) => {
            value!=null?filters[key] = value:null
        })

        return filters
    }

    function switchValues(courseKey, courseKeyValue, filterValue) {
        
        if (filterSwitchs[courseKey]) {
            return filterSwitchs[courseKey](courseKeyValue, filterValue)
        }
        return false
    }

    function filterModified(key, filterValue, coursesToFilter) {
        console.log(key, filterValue)
        const courses = filterValue!=null?
            coursesToFilter.filter(course => switchValues(key, course[key], filterValue))
            :coursesToFilter
        
        return courses
    }

    async function onClick(e) {
        e.preventDefault()
        const parent = e.currentTarget.parentElement
        const formData = new FormData(parent)

        let courses = getLocalCourses()
        formData.forEach((value, key) => {
            courses = filterModified(key, value, courses)
        })
        if (courses.length != 0 && courses.length%courseListLength == 0) {return}

        const data = getFiltersData(courses, formData)
        console.log(data, courses)

        let gettedCourses = []
        try {
            const requestParams=requestData.method=="GET"?
                {...requestData, params: data}
                :{...requestData, data: data}

            console.log(requestParams)
            const response = await axios(requestParams)

            if (response.data && response.data.courses instanceof Object) {
                gettedCourses = response.data.courses
            }
        } catch(error) {
            console.log(error)
        }

        setCurrentCourses([...courses, 
            ...courseListImagesToBlobURL(gettedCourses).map((course, _, array) => {
                return {...course, key:currentCourses.length + array.length + 1}
            })
        ])
    }

    return (
        <input type="submit" className={styles.submit} value="Apply" onClick={onClick}/>
    )
}