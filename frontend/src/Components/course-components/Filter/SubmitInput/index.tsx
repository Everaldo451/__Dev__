import { getState } from "../../../CourseCatalog/courseInCacheFunctions"
import { courseListLength } from "../../../../courseListLenght"
import { FilterProps, FilterType } from ".."

import { CourseType } from "../../../../types/CourseType"
import { courseArrayToHashMap } from "../../../CourseCatalog/courseInCacheFunctions"
import { courseListSortByDateTime, courseListImagesToBlobURL  } from "../../../../utils/courseListModifiers"

import StyledSubmitInput from "../../form-fields/StyledSubmitInput"
import axios from "axios"

interface SubmitInputProps {
    filterSwitchs: {[key: string]:FilterType},
    loadedCoursesHashMapState: Pick<FilterProps, "loadedCoursesHashMapState">["loadedCoursesHashMapState"],
    currentCourses: Pick<FilterProps, "currentCoursesState">["currentCoursesState"][0],
    setCurrentCourses: Pick<FilterProps, "currentCoursesState">["currentCoursesState"][1],
    requestData: FilterProps["requestData"]
}

export default function SubmitInput(
    {
        filterSwitchs,
        loadedCoursesHashMapState, 
        currentCourses, 
        setCurrentCourses, 
        requestData
    }: SubmitInputProps
) {
    const [loadedCoursesHashMap, setLoadedCoursesHashMap] = loadedCoursesHashMapState
    const getLocalCourses = () => getState(loadedCoursesHashMap)

    function filtersFormDataToObject(courses:CourseType[], filtersFormData:FormData) {
        const filters:{[key:string]: any} = {
            length: courses.length
        }
        filtersFormData.forEach((value, key) => {
            value!=""?filters[key] = value:null
        })
        return filters
    }

    function applyFilter(
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

    function applyFilterToAllCourses(
        courseAttr:keyof CourseType, 
        inputValue:FormDataEntryValue, 
        coursesToFilter:CourseType[]
    ) {
        console.log(courseAttr, inputValue)
        const courses = inputValue!==""?
            coursesToFilter.filter(course => applyFilter(courseAttr, course[courseAttr], inputValue))
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
            courses = applyFilterToAllCourses(key as keyof CourseType, value, courses)
        })
        if (courses.length != 0 && courses.length%courseListLength == 0) {
            courseListSortByDateTime(courses)
            setCurrentCourses(courses)
            return
        }

        const data = filtersFormDataToObject(courses, formData)

        const coursesToState:CourseType[] = []
        let fetchedCourses:CourseType[] = []
        try {
            const requestParams=requestData.method=="GET"?
                {...requestData, params: data}
                :{...requestData, data: data}

            const response = await axios(requestParams)

            console.log(response.data.courses)
            if (response.data && response.data.courses satisfies CourseType[]) {
                fetchedCourses = response.data.courses
            }
        } catch(error) {
            console.log(error)
        }
        
        console.log(fetchedCourses)
        fetchedCourses.forEach((value) => {
            if (!(String(value.id) in loadedCoursesHashMap)) {
                coursesToState.push(value)
            }
        })
        console.log(courses,coursesToState)

        const courseList = [...courses,
            ...courseListImagesToBlobURL(coursesToState).map((course, _, array) => {
                return {...course, key:currentCourses.length + array.length + 1}
            })
        ]
        courseListSortByDateTime(courseList)
        setCurrentCourses(courseList)
        if (coursesToState.length>0) {
            setLoadedCoursesHashMap(prev => ({...prev, ...courseArrayToHashMap(coursesToState)}))
        }
    }

    return (
        <StyledSubmitInput onClick={onClick} value="Apply"/>
    )
}