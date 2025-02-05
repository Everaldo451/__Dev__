import { getState } from "../../../CourseCatalog/courseInCacheFunctions"
import { courseListLength } from "../../../../courseListLenght"
import { FilterProps, FilterType } from ".."
import { courseListImagesToBlobURL } from "../../../../utils/courseListModifiers"
import { CourseType } from "../../../../types/CourseType"
import StyledSubmitInput from "../../form-fields/StyledSubmitInput"
import axios from "axios"

interface SubmitInputProps {
    filterSwitchs: {[key: string]:FilterType},
    unFilteredCourses: Pick<FilterProps, "unFilteredCoursesState">["unFilteredCoursesState"][0],
    currentCourses: Pick<FilterProps, "currentCoursesState">["currentCoursesState"][0],
    setCurrentCourses: Pick<FilterProps, "currentCoursesState">["currentCoursesState"][1],
    requestData: FilterProps["requestData"]
}

export default function SubmitInput(
    {
        filterSwitchs,
        unFilteredCourses, 
        currentCourses, 
        setCurrentCourses, 
        requestData
    }: SubmitInputProps
) {

    const getLocalCourses = () => getState(unFilteredCourses)

    function getFiltersData(courses:CourseType[], filtersFormData:FormData) {
        const filters:{[key:string]: any} = {
            length: courses.length
        }

        filtersFormData.forEach((value, key) => {
            value!=""?filters[key] = value:null
        })

        return filters
    }

    function switchValues(
        courseAttr:string, 
        courseAttrValue:any, 
        inputValue:FormDataEntryValue
    ) {
        const filterData = filterSwitchs[courseAttr]
        if (filterData) {
            return filterData.function(courseAttrValue, inputValue)
        }
        return false
    }

    function filterModified(
        courseAttr:keyof CourseType, 
        inputValue:FormDataEntryValue, 
        coursesToFilter:CourseType[]
    ) {
       
        const courses = inputValue!==""?
            coursesToFilter.filter(course => switchValues(courseAttr, course[courseAttr], inputValue))
            :coursesToFilter
        
        return courses
    }

    async function onClick(e:React.MouseEvent<HTMLInputElement>) {
        e.preventDefault()
        const parent = e.currentTarget.parentElement?
            e.currentTarget.parentElement as HTMLFormElement:undefined

        const formData = new FormData(parent)

        let courses = getLocalCourses()
        formData.forEach((value, key) => {
            courses = filterModified(key as keyof CourseType, value, courses)
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