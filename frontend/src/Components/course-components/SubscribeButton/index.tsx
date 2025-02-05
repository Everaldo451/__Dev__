import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { CourseType } from "../../../types/CourseType";

import { UserContext } from "../../../contexts/UserContext";
import { CSRFContext } from "../../../contexts/CSRFContext";
import { CourseContext } from "../../../contexts/CourseContext";

import CourseRouteCommonButton from "../../CourseRouteCommonButton";
import axios from "axios";


export default function SubscribeButton(
    {children, course}:{children:React.ReactNode, course:CourseType}
) {

    const [csrf_token, setCSRFToken] = useContext(CSRFContext)
    const [user, setUser] = useContext(UserContext)
    const [courses, setCourses] = useContext(CourseContext)
    const navigate = useNavigate()
    
    async function onclickIfNotUser(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        navigate("/login")
    }

    async function onclickIfUserIsStudent(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        try{

            const response = await axios.patch(`/api/me/courses/${course.id}`,undefined,
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken':`${csrf_token}`
                    }
                })

            if (response.status == 200) {
                const courseToAdd = {...course}
                courseToAdd.student_count += 1
                setCourses(prev => new Set([courseToAdd, ...prev]))
        
                navigate("/")
            }

        } catch(error) {console.log(error)}
    }

    function onClick() {
        if (!user) {return onclickIfNotUser}
        if (user.user_type == "student") {return onclickIfUserIsStudent}
    }

    return <CourseRouteCommonButton onClick={onClick()}>{children}</CourseRouteCommonButton>

}