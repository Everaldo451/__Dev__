import { getState } from "../../../CourseCatalog/coursesInCacheFunctions"
import { courseListLength } from "../../../../CourseListLength"
import { courseListImagesToBlobURL } from "../../../../utils/courseListModifiers"
import axios from "axios"

export default function SubmitInput({unFilteredCourses, currentCourses, setCurrentCourses, requestData}) {

    const getLocalCourses = () => getState(unFilteredCourses)

    function getFiltersData(courses, filtersFormData) {
        const filters = {
            length: courses.length
        }

        filtersFormData.forEach((value, key) => {
            if (value instanceof Object && value.state && value.setter) {
                value.state!=null?
                    filters[key] = value.state
                    :null
            } else {
                value!=null?
                    filters[key] = value
                    :null
            }
        })

        return filters
    }

    function filterModified(key, filterValue, coursesToFilter, equalTo) {
        console.log(key, filterValue, coursesToFilter)
        const courses = filterValue!=null?
            coursesToFilter.filter(course => course[key] == filterValue)
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
            const response = await axios({...requestData, data: data})

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
        <input type="submit" onClick={onClick}/>
    )
}