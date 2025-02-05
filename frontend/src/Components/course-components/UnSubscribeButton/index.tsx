import { SetStateAction, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { CourseType } from "../../../types/CourseType";

import { UserContext } from "../../../contexts/UserContext";
import { CourseContext } from "../../../contexts/CourseContext";
import { CSRFContext } from "../../../contexts/CSRFContext";
import styles from "./index.module.css"
import axios from "axios";

export default function UnSubscribeButton(
    {course}:{course:CourseType}
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

            const response = await axios.delete(`/api/me/courses/${course.id}`,
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken':`${csrf_token}`
                    }
                })

            if (response.status == 200) {
                setCourses(prev => new Set([...prev].filter((value) => value.id != course.id)))
                navigate("/")
            }

        } catch(error) {console.log(error)}
    }

    function onClick() {
        if (!user) {return onclickIfNotUser}
        if (user.user_type == "student") {return onclickIfUserIsStudent}
    }
    return (
        <button className={styles.unSubscribe} onClick={onClick()}>
            <img></img>
        </button>
    )
}