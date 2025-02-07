import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CourseType } from "../../../types/CourseType";

import { CSRFContext } from "../../../contexts/CSRFContext";
import { CourseContext } from "../../../contexts/CourseContext";

import SubscribePageButton from "../SubscribePageButton";
import axios from "axios";


export default function SubscribeButton(
    {children, course}:{children:React.ReactNode, course:CourseType}
) {

    const [csrf_token, setCSRFToken] = useContext(CSRFContext)
    const [courses, setCourses] = useContext(CourseContext)
    const navigate = useNavigate()

    async function onClickIfUserIsStudent(e:React.MouseEvent<HTMLButtonElement>) {
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

    return <SubscribePageButton onClickIfUserIsStudent={onClickIfUserIsStudent}>{children}</SubscribePageButton>

}