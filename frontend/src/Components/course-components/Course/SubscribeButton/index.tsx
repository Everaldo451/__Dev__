import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CourseType } from "../../../../types/CourseType";

import { CourseContext } from "../../../../contexts/CourseContext";

import SubscribePageButton from "../SubscribePageButton";
import { api } from "../../../../api/api";


export default function SubscribeButton(
    {children, course}:{children:React.ReactNode, course:CourseType}
) {

    const [__, setCourses] = useContext(CourseContext)
    const navigate = useNavigate()

    async function onClickIfUserIsStudent(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        try{

            const response = await api.patch(`/me/courses/${course.id}`,undefined,
                {
                    withCredentials: true,
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