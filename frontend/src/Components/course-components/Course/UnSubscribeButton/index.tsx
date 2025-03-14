import { useContext } from "react";
import { CourseType } from "../../../../types/CourseType";

import { CourseContext } from "../../../../contexts/CourseContext";

import SubscribePageButton from "../SubscribePageButton";
import { api } from "../../../../api/api";

export default function UnSubscribeButton(
    {children, course}:{children:React.ReactNode, course:CourseType}
) {
    const [__, setCourses] = useContext(CourseContext)

    async function onClickIfUserIsStudent(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        try{
            const response = await api.delete(`/me/courses/${course.id}`,
                {
                    withCredentials: true,
                })

            if (response.status == 200) {
                setCourses(prev => [...prev].filter((value) => value.id != course.id))
            }
        } catch(error) {console.log(error)}
    }

    return <SubscribePageButton onClickIfUserIsStudent={onClickIfUserIsStudent}>{children}</SubscribePageButton>
}