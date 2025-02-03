import { getState } from "../../../CourseCatalog/courseInCacheFunctions"
import { courseListLength } from "../../../../courseListLength"
import { courseListImagesToBlobURL } from "../../../../utils/courseListModifiers"
import StyledSubmitInput from "../../form-fields/StyledSubmitInput"
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
            value!=""?filters[key] = value:null
        })

        return filters
    }

    function switchValues(courseKey, courseKeyValue, filterValue) {
        const filterData = filterSwitchs[courseKey]
        if (filterData) {
            const fn = filterData.function
            return fn(courseKeyValue, filterValue)
        }
        return false
    }

    function filterModified(key, filterValue, coursesToFilter) {
        const courses = filterValue!==""?
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

        let gettedCourses = []
        try {
            const requestParams=requestData.method=="GET"?
                {...requestData, params: data}
                :{...requestData, data: data}

            const response = await axios(requestParams)

            if (response.data && response.data.courses instanceof Object) {
                gettedCourses = response.data.courses
            }
        } catch(error) {
            console.log(error)
        }
        console.log(courses,gettedCourses)

        setCurrentCourses([...courses, 
            ...courseListImagesToBlobURL(gettedCourses).map((course, _, array) => {
                return {...course, key:currentCourses.length + array.length + 1}
            })
        ])
    }

    return (
        <StyledSubmitInput onClick={onClick} value="Apply"/>
    )
}