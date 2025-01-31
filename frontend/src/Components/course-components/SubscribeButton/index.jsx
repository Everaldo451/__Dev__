import { useContext } from "react";
import { User, CSRFContext, Courses } from "../../../MainContexts"
import CourseRouteCommonButton from "../../CourseRouteCommonButton";
import axios from "axios";

export default function SubscribeButton({children, course}) {

    const [csrf_token, setCSRFToken] = useContext(CSRFContext)
    const [user, setUser] = useContext(User)
    const [courses, setCourses] = useContext(Courses)
    
    async function onclickIfNotUser(e) {
        e.preventDefault()
        navigate("/login")
    }

    async function onclickIfUserIsStudent(e) {
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