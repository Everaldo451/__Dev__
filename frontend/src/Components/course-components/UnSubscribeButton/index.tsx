import { useContext } from "react";
import { CourseType } from "../../../types/CourseType";

import { CourseContext } from "../../../contexts/CourseContext";
import { CSRFContext } from "../../../contexts/CSRFContext";

import SubscribePageButton from "../SubscribePageButton";
import axios from "axios";

export default function UnSubscribeButton(
    {children, course}:{children:React.ReactNode, course:CourseType}
) {
    const [csrf_token, _] = useContext(CSRFContext)
    const [__, setCourses] = useContext(CourseContext)

    async function onClickIfUserIsStudent(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        try{
            const response = await axios.delete(`/api/me/courses/${course.id}`,
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken':`${csrf_token}`
                    }
                })

            if (response.status == 200) {
                setCourses(prev => new Set([...prev].filter((value) => value.id != course.id)))
            }
        } catch(error) {console.log(error)}
    }

    return <SubscribePageButton onClickIfUserIsStudent={onClickIfUserIsStudent}>{children}</SubscribePageButton>
}